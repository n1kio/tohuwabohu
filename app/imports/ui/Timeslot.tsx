import React, { useState } from 'react'
import styled from 'styled-components'
import Swal from 'sweetalert2'
import DatePicker from 'react-datepicker'

import { Event, Participant } from '/imports/api/events'
import { Base, Button, ButtonPrimary, FullInput } from '/imports/ui/Primitives'
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
    background-color: ${props => props.selected ? colors.success : 'inherit'};
    color: ${props => props.selected ? colors.light : 'inherit'};
    display: block;
    text-align: left;
    font-weight: ${props => props.selected ? 'bold' : 'inherit'};

    .timestring {
        margin-bottom: 10px;
    }

    .spread-horizontal {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

`

const Timeslot = (props:TimeslotProps) => {
    if(!props.participants || !props.userEmail || !props.timeslot) {
        console.log('no props')
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
                <div className="confirm-state">
                    {selected ? 'bestätigt' : 'unbestätigt'}
                </div>
            </div>
            {props.children}
        </TimeslotStyle>
    )
}

interface AvailableTimeslotsProps {
    event:Event
    userEmail:string
}

const AvailableTimeslots = (props:AvailableTimeslotsProps) => {
    const event = props.event
    const userEmail = props.userEmail
    if(event && userEmail) {
        const eventId = event._id
        return (
            <div>
                {uniqueTimeslots(event).sort((a, b) => {return a - b}).map((timeslot, i) => {
                    return (
                        <Timeslot key={i}
                                  onClick={() => {
                                      Meteor.call('events.toggleTimeslot', {timeslot, eventId, userEmail}, (err) => {
                                          if(err) {
                                              Swal.fire({
                                                  title: 'Konnte Vorschlag nicht akzeptieren.',
                                                  text: err,
                                                  icon: 'error'
                                              })
                                          }
                                  })}}
                                  participants={event.participants}
                                  userEmail={userEmail}
                                  timeslot={timeslot}
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
                <AvailableTimeslots event={event} userEmail={userEmail} />
            ) : null}
            <div>
                <DatePicker timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            minDate={new Date()}
                            dateFormat="d. MMMM yyyy, HH:mm"
                            placeholderText="Neuen Vorschlag hinzufügen"
                            showTimeSelect
                            selected={proposedTimeslot}
                            customInput={<FullInput/>}
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

                    }}>Vorschlag senden</Button>
                ) : null}
            </div>

            {userEmail === event.authorEmail ? (
                <div>
                    <hr/>

                    <ButtonPrimary onClick={() => {
                        Swal.fire({
                            title: 'Event finalisieren und Teilnehmer benachrichtigen',
                            text: 'Diese Aktion kann nicht rückgängig gemacht werden!',
                            showCancelButton: true,
                            cancelButtonText: 'Abbrechen',
                            confirmButtonText: 'Finalisieren'
                        }).then((res) => {
                            if (res.value) {
                                Meteor.call('events.finalize', eventId, (err) => {
                                    if(err) {
                                        Swal.fire({
                                            icon: 'error',
                                            title: `Event konnte nicht finalisiert werden.`,
                                            text: err
                                        })
                                    } else {
                                        Swal.fire({
                                            icon: 'success',
                                            title: `Event wurde finalisiert`,
                                            timer: 1000,
                                            showConfirmButton: false
                                        })
                                    }
                                })
                            }
                    })}}>
                        Zeitpunkt festlegen und finalisieren
                    </ButtonPrimary>
                </div>
            ) : null}
        </div>

    )
}

export { Timeslot, TimeslotPropose }
