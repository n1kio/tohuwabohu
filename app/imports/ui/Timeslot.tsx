import React, { useState } from 'react'
import styled from 'styled-components'
import Swal from 'sweetalert2'
import DatePicker from 'react-datepicker'

import { Event, Participant } from '/imports/api/events'
import { Base, Button, Input } from '/imports/ui/Primitives'
import colors from '/imports/ui/Colors'
import { hasParticipantTimeslot, uniqueTimeslots, formatDateTime, countParticipants } from '/imports/util'

interface TimeslotProps {
    participants:[Participant]
    userEmail:string
    timeslot:Date
    onClick:Function
    children?:[React.Component] | undefined
}

const TimeslotStyle = styled(Base)`
    background-color: ${props => (props.selected && !props.plain) ? colors.success : 'inherit'};
    color: ${props => (props.selected && !props.plain) ? colors.light : 'inherit'};
    display: block;
    text-align: left;
    font-weight: ${props => props.selected ? 'bold' : 'inherit'};

    .timestring {
        margin-bottom: 10px;
    }
`

const Timeslot = (props:TimeslotProps) => {
    if(!props.participants || !props.userEmail || !props.timeslot) {
        return null
    }
    const selected = hasParticipantTimeslot(props.participants, props.userEmail, props.timeslot)
    const timeslotString = formatDateTime(props.timeslot)
    return (
        <TimeslotStyle {...props} selected={selected}>
            <div className="spread-horizontal">
                <div>
                    <div className="timestring">
                        {timeslotString}
                    </div>
                    <div className="participant-indicator">
                        {countParticipants(props.participants, props.timeslot)} Teilnehmer
                    </div>
                </div>
                {!props.plain ? (
                    <div className="confirm-state">
                        {selected ? 'bestätigt' : 'unbestätigt'}
                    </div>
                ) : (
                    "finalisieren und E-Mails versenden"
                )}
            </div>
            {props.children}
        </TimeslotStyle>
    )
}

interface AvailableTimeslotsProps {
    event:Event
    userEmail:string
    onClickCb:Function
    plain?:boolean
}

const AvailableTimeslots = (props:AvailableTimeslotsProps) => {
    const event = props.event
    const userEmail = props.userEmail
    const onClickCb = props.onClickCb
    const plain = props.plain

    if(event && userEmail) {
        const timeslots = uniqueTimeslots(event)
        return (
            <div>
                {timeslots.sort((a, b) => {return a - b}).map((timeslot:Date, i:number) => {
                    return (
                        <Timeslot key={i}
                                  onClick={() => {onClickCb(timeslot)}}
                                  participants={event.participants}
                                  userEmail={userEmail}
                                  timeslot={timeslot}
                                  plain={plain}
                        />
                    )
                })}
            </div>
        )
    } else {
        return null
    }
}

interface TimeslotProposeProps {
    event:Event
    userEmail:string
}

const TimeslotPropose = (props:TimeslotProposeProps) => {
    // hooks to control the display of the proposal menu
    const [propose, setPropose] = useState<Boolean>()

    // hooks for storing the actually proposed time in state
    const [proposedTimeslot, setProposeTimeslot] = useState<Date>()
    const event = props.event
    const eventId = event._id
    const userEmail = props.userEmail

    return (
        <div>
            {(event && event.participants) ? (
                <AvailableTimeslots event={event}
                                    userEmail={userEmail}
                                    onClickCb={(timeslot:Date) => {
                                        Meteor.call('events.toggleTimeslot', {timeslot, eventId, userEmail}, (err) => {
                                            if(err) {
                                                Swal.fire({
                                                    title: 'Konnte Vorschlag nicht akzeptieren.',
                                                    text: err,
                                                    icon: 'error'
                                                })
                                            }
                                        })
                                    }} />
            ) : null}
            <div className="spread-horizontal">
                <DatePicker timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            minDate={new Date()}
                            dateFormat="d. MMMM yyyy, HH:mm"
                            placeholderText={uniqueTimeslots(event).length > 0 ? "Neuen Vorschlag hinzufügen" : "Ersten Vorschlag hinzufügen"}
                            showTimeSelect
                            selected={proposedTimeslot}
                            customInput={<Input/>}
                            onChange={(date:Date) => {
                                setProposeTimeslot(date)
                                setPropose(true)
                            }}
                />
                {propose ? (
                    <Button onClick={() => {
                        setPropose(false)
                        if(hasParticipantTimeslot(event.participants, userEmail, proposedTimeslot)) {
                            Swal.fire({
                                title: 'Vorschlag bereits hinzugefügt.',
                                icon: 'info'
                            })
                            return
                        }
                        Meteor.call('events.toggleTimeslot', {eventId, timeslot: proposedTimeslot, userEmail}, (err) => {
                            setProposeTimeslot(undefined)
                            if(err) {
                                Swal.fire({
                                    title: 'Konnte Vorschlag nicht hinzufügen.',
                                    text: err,
                                    icon: 'error'
                                })
                            }
                        })

                    }}>speichern</Button>
                ) : null}
            </div>
        </div>
    )
}

export { Timeslot, TimeslotPropose, AvailableTimeslots }
