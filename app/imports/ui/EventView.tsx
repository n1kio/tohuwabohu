import React, { useState, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import Swal from 'sweetalert2'
import { Event, Participant } from '/imports/api/events'
import ls from 'local-storage'
import DatePicker from 'react-datepicker'

import { Layout } from '/imports/ui/Layout'
import { FullButton, Button, Select, Input, FullInput } from '/imports/ui/Primitives'

const loadEvent = (eventId, cb) => {
    Meteor.call('events.get', eventId, (err : any, res : Event) => {
        if(err) {
            Swal.fire({
                'title': 'Konnte Event nicht laden',
                'text': err,
                'icon': 'error'
            })
        } else {
            cb(res)
        }
    })
}

const uniqueTimeslots = (event : Event) => {
    let timeslots = new Set()
    const participants = event.participants || []
    participants.forEach((participant) => {
        participant.timeslots.forEach((timeslot) => {
            timeslots.add(timeslot)
        })
    })
    return Array.from(timeslots)
}

const defaultText = (text : string | undefined) => {
    if(text === '') {
        return 'keine Angabe'
    }
    return text
}

interface UserSelectionProps {
    participants: [Participant]
    selected: string
}

const UserSelection = (props : UserSelectionProps) => {
    const [selected, setSelected] = useState(props.selected)
    return (
        <div>
            <span>Du bist </span>
            <Select type="dropdown" value={selected} onChange={(e)=> {
                setSelected(e.target.value)
                ls('userEmail', e.target.value)
            }}
            >
                <option value="">Namen wählen</option>
                {props.participants.map((participant, i) => {
                    return (
                        <option key={i} value={participant.email}>
                            {participant.name}
                        </option>
                    )
                })}
            </Select>
        </div>
    )
}

const EventView = () => {
    const [event, setEvent] = useState<Event>()

    // hooks to control the display of the proposal menu
    const [propose, setPropose] = useState<Boolean>()

    // hooks for storing the actually proposed time in state
    const [proposeTimeslot, setProposeTimeslot] = useState<Date>()

    const eventId = FlowRouter.getParam('eventId')

    useEffect(() => {
        loadEvent(eventId, setEvent)
    }, [])

    return (
        <Layout>
            {event ? (
                <div>
                    <p>{event.authorName} hat dich zu einem Online-Treffen eingeladen.</p>

                    <UserSelection participants={event.participants} selected={ls('userEmail')} />

                    <hr />

                    <h1>{defaultText(event.title)}</h1>
                    <p>{defaultText(event.description)}</p>

                    <p>Raum: {defaultText(event.space)}</p>

                    <hr />

                    <h2>Vorschlag bestätigen oder hinzufügen</h2>
                    <div>
                        {(event && event.participants) ? uniqueTimeslots(event).map((timeslot, i) => {
                            return (
                                <FullButton key={i} onClick={()=> {}}
                                >
                                    <p>{'' + timeslot}</p>
                                </FullButton>
                            )
                        }) : null}
                        <div>
                            <DatePicker timeFormat="HH:mm"
                                        timeIntervals={15}
                                        timeCaption="time"
                                        minDate={new Date()}
                                        dateFormat="MMMM d, yyyy HH:mm"
                                        placeholderText="Neuen Vorschlag machen"
                                        showTimeSelect
                                        selected={proposeTimeslot}
                                        onChange={(date) => {
                                            setProposeTimeslot(date)
                                            setPropose(true)
                                        }}
                            />
                            {propose ? (
                                <Button onClick={() => {
                                    setPropose(false)
                                    Meteor.call('events.toggleTimeslot', {eventId: eventId, timeslot: proposeTimeslot, userEmail: ls('userEmail')}, (err, res) => {
                                        setProposeTimeslot(undefined)
                                        if(err) {
                                            Swal.fire({
                                                title: 'Konnte Vorschlag nicht hinzufügen.',
                                                text: err,
                                                icon: 'error'
                                            })
                                        } else {
                                            loadEvent(eventId, setEvent)
                                            Swal.fire({
                                                icon: 'success',
                                                title: 'Vorschlag angelegt!',
                                                timer: 1000,
                                                showConfirmButton: false
                                            })
                                        }
                                    })

                                }}>Vorschlag senden</Button>
                            ) : null}

                        </div>
                    </div>

                    {/* TODO real share link */}
                    <p>Link zum Teilen: <a href={'' + window.location}>{'' + window.location}</a></p>
                </div>
            ) : null}
        </Layout>
    )
}

export default EventView
