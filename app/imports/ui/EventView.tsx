import React, { useState, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import Swal from 'sweetalert2'
import { Event, Participant } from '/imports/api/events'
import ls from 'local-storage'

import { Layout } from '/imports/ui/Layout'
import { Select } from '/imports/ui/Primitives'

const defaultText = (text : string | undefined) => {
    if(text === '') {
        return 'keine Angabe'
    }
    return text
}

interface UserSelectionProps {
    participants: [Participant]
    selected: Participant
}

const UserSelection = (props : UserSelectionProps) => {
    const [selected, setSelected] = useState(props.selected)
    return (
        <div>
            <span>Du bist </span>
            <Select type="dropdown"
                    value={selected}
                    onChange={(e) => {
                        setSelected(e.target.value)
                        ls('userEmail', e.target.value)
                    }}
            >
                <option value="">Namen auswählen</option>
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
    const eventId = FlowRouter.getParam('eventId')

    useEffect(() => {
        Meteor.call('events.get', eventId, (err : any, res : Event) => {
            if(err) {
                Swal.fire({
                    'title': 'Konnte Event nicht laden',
                    'text': err,
                    'icon': 'error'
                })
            } else {
                setEvent(res)
            }
        })
    }, [])

    return (
        <Layout> {event ? (
                <div>
                    <UserSelection participants={event.participants} selected={ls('userEmail')} />
                    <h1>Titel: {defaultText(event.title)}</h1>

                    <h2>Beschreibung</h2>
                    <p>{defaultText(event.description)}</p>

                    <h2>Organisator</h2>
                    <p>{defaultText(event.authorName)}</p>

                    <h2>Raum</h2>
                    <p>{defaultText(event.space)}</p>

                    <h2>Terminvorschläge</h2>
                    <ul>
                        {(event && event.participants) ? event.participants.map((participant, i) => {
                            return (
                                <li key={i}>
                                    <h3>{participant.email} {participant.email === event.authorEmail ? "(Ersteller)" : null}</h3>
                                    <ul>
                                        <li>{participant.timeslots.map((slot : Date) => '' + slot)}</li>
                                    </ul>
                                </li>
                            )
                        }) : <h1>Loading</h1>}
                    </ul>

                    <h2>Link zum Weiterschicken</h2>
                    <p>{'' + window.location}</p>
                </div>
        ) : (
                null
            )}
        </Layout>
    )
}

export default EventView
