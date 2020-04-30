import React, { useState, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { FlowRouter } from 'meteor/kadira:flow-router'

import Swal from 'sweetalert2'
import ls from 'local-storage'
import DatePicker from 'react-datepicker'

import { EventsCollection } from '/imports/api/events'
import { Layout } from '/imports/ui/Layout'
import { FullButton, Button, FullInput } from '/imports/ui/Primitives'
import UserSelection from '/imports/ui/UserSelection'
import { hasParticipantTimeslot, uniqueTimeslots, formatDateTime } from '/imports/util'


const defaultText = (text : string | undefined) => {
    if(text === '') {
        return 'keine Angabe'
    }
    return text
}

const EventView = (props) => {
    const event = props.event
    const [userEmail, setUserEmail] = useState<string | void>(ls('userEmail'))

    // hooks to control the display of the proposal menu
    const [propose, setPropose] = useState<Boolean>()

    // hooks for storing the actually proposed time in state
    const [proposedTimeslot, setProposeTimeslot] = useState<Date>()

    const eventId = FlowRouter.getParam('eventId')

    useEffect(() => {
        Meteor.subscribe('event', eventId)
    }, [])

    return (
        <Layout>
            {event ? (
                <div>
                    <h1>Einladung zu "{defaultText(event.title)}"</h1>

                    <p>{event.authorName} hat dich zu einem Online-Treffen eingeladen.</p>
                    <p>Wähle deinen Namen oder füge einen neuen Namen hinzu um über den Zeitpunkt abzustimmen.</p>

                    <UserSelection eventId={event._id}
                                   participants={event.participants}
                                   selected={userEmail}
                                   changeCb={(res : string | undefined) => {
                                       if(res) {
                                           setUserEmail(res)
                                       }
                                   }}
                    />

                    <hr />

                    <p><strong>Beschreibung</strong>: {defaultText(event.description)}</p>

                    <p><strong>Raum</strong>: {defaultText(event.space)}</p>
                    {event.final ? <p>Zeit: {event.finalDate}</p> : null}

                    <hr />

                    {(userEmail && !event.final) ? (
                        <div>
                            <h2>Wann kannst du?</h2>
                            <p>Du kannst einen der Vorschläge bestätigen oder einen neuen hinzufügen.</p>
                            <div>
                                {(event && event.participants) ? uniqueTimeslots(event).sort((a, b) => {return a - b}).map((timeslot, i) => {
                                    const confirmed = hasParticipantTimeslot(event.participants, userEmail, timeslot)
                                    return (
                                        <FullButton key={i} primary={confirmed} onClick={() => {
                                            Meteor.call('events.toggleTimeslot', {timeslot, eventId, userEmail}, (err) => {
                                                if(err) {
                                                    Swal.fire({
                                                        title: 'Konnte Vorschlag nicht akzeptieren.',
                                                        text: err,
                                                        icon: 'error'
                                                    })
                                                }
                                            })
                                        }}>
                                            <div>
                                                <div>{formatDateTime(timeslot)}</div>
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

                                <hr/>

                                <Button variant="primary"
                                            onClick={() => {
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
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </div>
            ) : null}
        </Layout>
    )
}

export default withTracker(() => {
    const eventId = FlowRouter.getParam('eventId')
    const handle = Meteor.subscribe('event', eventId)
    return {
        loading: !handle.ready(),
        event: EventsCollection.findOne({_id: eventId})
    }
})(EventView)
