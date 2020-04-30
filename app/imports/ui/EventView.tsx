import React, { useState, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { FlowRouter } from 'meteor/kadira:flow-router'

import ls from 'local-storage'

import { EventsCollection } from '/imports/api/events'
import { Layout } from '/imports/ui/Layout'
import { TimeslotPropose } from '/imports/ui/Timeslot'
import UserSelection from '/imports/ui/UserSelection'


const defaultText = (text : string | undefined) => {
    if(text === '') {
        return 'keine Angabe'
    }
    return text
}

const EventView = (props) => {
    const event = props.event
    const [userEmail, setUserEmail] = useState<string | void>(ls('userEmail'))
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

                    <p><strong>Titel</strong>: {defaultText(event.title)}</p>
                    <p><strong>Beschreibung</strong>: {defaultText(event.description)}</p>
                    <p><strong>Raum</strong>: {defaultText(event.space)}</p>

                    {event.final ? <p>Zeit: {event.finalDate}</p> : null}

                    <hr />

                    {(userEmail && !event.final) ? (
                        <div>
                            <h2>Wann kannst du?</h2>
                            <p>Du kannst einen der Vorschläge bestätigen oder einen neuen hinzufügen.</p>
                            <TimeslotPropose
                                event={event}
                                userEmail={userEmail}
                            />
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
