import React, { useState, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import Swal from 'sweetalert2'
import { Event, Participant } from '/imports/api/events'
import ls from 'local-storage'
import DatePicker from 'react-datepicker'

import { Layout } from '/imports/ui/Layout'
import { FullButton, Button, Select, Input, FullInput } from '/imports/ui/Primitives'
import { hasParticipantTimeslot } from '/imports/util'

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

const uniqueTimeslots = (event:Event) => {
    let timestrings = new Set()
    const participants = event.participants || []
    participants.forEach((participant) => {
        participant.timeslots?.forEach((timeslot) => {
            timestrings.add('' + timeslot)
        })
    })
    const uniqueSlots = Array.from(timestrings).map((timestring) => new Date(timestring))
    return uniqueSlots
}

const defaultText = (text : string | undefined) => {
    if(text === '') {
        return 'keine Angabe'
    }
    return text
}

interface UserSelectionProps {
    participants: [Participant]
    selected?: string
    eventId?: string
    changeCb: Function
}

const UserSelection = (props : UserSelectionProps) => {
    const [selected, setSelected] = useState(props.selected)
    const [showAdd, setShowAdd] = useState<Boolean>(false)
    const [newName, setNewName] = useState<string>('')
    const [newEmail, setNewEmail] = useState<string>('')
    const changeCb = props.changeCb

    return (
        <div>
            <span>Du bist </span>
            <Select type="dropdown" value={selected || ''} onChange={(e) => {
                const newUserEmail = e.target.value
                setSelected(newUserEmail)
                ls('userEmail', newUserEmail)
                changeCb(newUserEmail)
            }}
            >
                {!ls('userEmail') ? (
                    <option value="">Namen wählen</option>
                ) : null}
                {props.participants?.map((participant, i) => {
                    return (
                        <option key={i} value={participant.email}>
                            {participant.name}
                        </option>
                    )
                })}
            </Select>
            {showAdd ? (
                <div>
                    <FullInput placeholder="Name"
                               type="text"
                               value={newName}
                               onChange={(e) => {
                                   setNewName(e.target.value)
                               }} />
                    <FullInput placeholder="E-Mail Adresse"
                               type="email"
                               value={newEmail}
                               onChange={(e) => {
                                   setNewEmail(e.target.value)
                               }} />
                    <FullButton onClick={() => {
                        const participant = {
                            name: newName,
                            email: newEmail
                        }
                        if([newName, newEmail].includes('')) {
                            Swal.fire({
                                text: 'Bitte Namen und E-Mail Adresse für neue Teilnehmer angeben.',
                                icon: 'warning'
                            })
                            return false
                        }
                        Meteor.call('events.addParticipant', {eventId: props.eventId, participant}, (err) => {
                            if(err) {
                                Swal.fire({
                                    title: 'Konnte Vorschlag nicht hinzufügen.',
                                    text: err,
                                    icon: 'error'
                                })
                            } else {
                                setShowAdd(false)
                                setNewName('')
                                setNewEmail('')
                                changeCb()
                                Swal.fire({
                                    icon: 'success',
                                    title: `${participant.name} hinzugefügt.`,
                                    timer: 1000,
                                    showConfirmButton: false
                                })
                            }
                        })
                    }}>
                        Teilnehmer hinzufügen
                    </FullButton>
                    <FullButton onClick={()=>{
                        setShowAdd(false)
                        setNewName('')
                        setNewEmail('')
                    }}>
                        abbrechen
                    </FullButton>
                </div>
            ) : (
                <Button onClick={()=>{
                    setShowAdd(true)
                }}>+</Button>
            )}

        </div>
    )
}

const EventView = () => {
    const [event, setEvent] = useState<Event>()
    const [userEmail, setUserEmail] = useState<string | void>(ls('userEmail'))

    // hooks to control the display of the proposal menu
    const [propose, setPropose] = useState<Boolean>()

    // hooks for storing the actually proposed time in state
    const [proposedTimeslot, setProposeTimeslot] = useState<Date>()

    const eventId = FlowRouter.getParam('eventId')

    useEffect(() => {
        loadEvent(eventId, setEvent)
    }, [])

    return (
        <Layout>
            {event ? (
                <div>
                    <p>{event.authorName} hat dich zu einem Online-Treffen eingeladen.</p>

                    <UserSelection eventId={event._id}
                                   participants={event.participants}
                                   selected={userEmail}
                                   changeCb={(res : string | undefined) => {
                                       if(res) {
                                           setUserEmail(res)
                                       }
                                       loadEvent(eventId, setEvent)
                                   }}
                    />

                    <hr />

                    <h1>{defaultText(event.title)}</h1>
                    <p>{defaultText(event.description)}</p>

                    <p>Raum: {defaultText(event.space)}</p>

                    <hr />

                    {userEmail ? (
                        <div>
                            <h2>Vorschlag bestätigen oder hinzufügen</h2>
                            <div>
                                {(event && event.participants) ? uniqueTimeslots(event).map((timeslot, i) => {
                                    const confirmed = hasParticipantTimeslot(event.participants, userEmail, timeslot)
                                    return (
                                        <FullButton key={i} primary={confirmed} onClick={() => {
                                            Meteor.call('events.toggleTimeslot', {timeslot, eventId, userEmail}, (err) => {
                                                console.log('before load')
                                                if(err) {
                                                    Swal.fire({
                                                        title: 'Konnte Vorschlag nicht akzeptieren.',
                                                        text: err,
                                                        icon: 'error'
                                                    })
                                                } else {
                                                    loadEvent(eventId, setEvent)
                                                }
                                            })
                                        }}>
                                            <div>
                                                <div>{'' + timeslot}</div>
                                                <div>{confirmed ? "(bestätigt)" : "(unbestätigt)"}</div>
                                            </div>
                                        </FullButton>
                                    )
                                }) : null}
                                <div>
                                    <DatePicker timeFormat="HH:mm"
                                                timeIntervals={15}
                                                timeCaption="time"
                                                minDate={new Date()}
                                                dateFormat="MMMM d, yyyy HH:mm"
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
                                            Meteor.call('events.toggleTimeslot', {eventId, timeslot: proposedTimeslot, userEmail}, (err) => {
                                                setProposeTimeslot(undefined)
                                                if(err) {
                                                    Swal.fire({
                                                        title: 'Konnte Vorschlag nicht hinzufügen.',
                                                        text: err,
                                                        icon: 'error'
                                                    })
                                                } else {
                                                    loadEvent(eventId, setEvent)
                                                }
                                            })

                                        }}>Vorschlag senden</Button>
                                    ) : null}

                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* TODO real share link */}
                    <p>Link zum Teilen: <a href={'' + window.location}>{'' + window.location}</a></p>
                </div>
            ) : null}
        </Layout>
    )
}

export default EventView
