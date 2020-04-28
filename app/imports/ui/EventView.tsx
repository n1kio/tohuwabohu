import React, { useState, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import Swal from 'sweetalert2'
import { Event, Participant } from '/imports/api/events'
import ls from 'local-storage'

import { Layout } from '/imports/ui/Layout'
import Timeslot from '/imports/ui/Timeslot'
import { Select } from '/imports/ui/Primitives'

const uniqueTimeslots = (event : Event) => {
    let timeslots = new Set()
    const participants = event.participants || []
    participants.forEach((participant) => {
        timeslots.add(participant.timeslots)
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
        <Layout>
            {event ? (
                <div>
                    <p>{event.authorName} hat dich zu einem Online-Treffen eingeladen.</p>

                    <UserSelection participants={event.participants} selected={ls('userEmail')} />

                    <hr/>

                    <h1>{defaultText(event.title)}</h1>
                    <p>{defaultText(event.description)}</p>

                    <p>Raum: {defaultText(event.space)}</p>

                    <hr/>

                    <h2>Wann kannst du?</h2>
                    <div>
                        {(event && event.participants) ? uniqueTimeslots(event).map((timeslot, i) => {
                            return <Timeslot key={i} datetime={timeslot} />
                        }) : null}
                    </div>

                    {/* TODO real share link */}
                    <p>Link zum Teilen: <a href={'' + window.location}>{'' + window.location}</a></p>
                </div>
            ) : null}
        </Layout>
    )
}

export default EventView
