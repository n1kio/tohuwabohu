import React, { useState, useEffect } from 'react'
import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { FlowRouter } from 'meteor/kadira:flow-router'

import ls from 'local-storage'

import { EventsCollection } from '/imports/api/events'
import { Layout } from '/imports/ui/Layout'
import { TimeslotPropose } from '/imports/ui/Timeslot'
import { ButtonSuccess, ButtonPrimary } from '/imports/ui/Primitives'
import UserSelection from '/imports/ui/UserSelection'
import EventDetails from '/imports/ui/EventDetails'
import { defaultText } from '/imports/util'

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

                    <p>
                        {event.authorName} hat dich zu einem Online-Treffen eingeladen.
                    </p>

                    {!event.final ? (
                        <div>
                            <p>
                                Wähle einen existierenden Teilnehmer oder füge einen neuen hinzu.
                            </p>
                            <UserSelection eventId={event._id}
                                           participants={event.participants}
                                           selected={userEmail}
                                           changeCb={(res : string | undefined) => {
                                               if(res) {
                                                   setUserEmail(res)
                                               }
                                           }} />
                        </div>
                    ) : null}

                    <EventDetails eventId={event._id}
                                  title={defaultText(event.title)}
                                  description={defaultText(event.description)}
                                  space={defaultText(event.space)}
                                  participants={event.participants}
                                  finalDate={event.finalDate}
                                  final={event.final} />

                    <hr />

                    {(userEmail && !event.final) ? (
                        <div>
                            <h2>Wann kannst du?</h2>
                            <p>Du kannst einen vorhandenen Vorschläg bestätigen oder einen neuen hinzufügen.</p>
                            <TimeslotPropose
                                event={event}
                                userEmail={userEmail} />
                        </div>
                    ) : null}

                    {(userEmail === event.authorEmail) && !event.final ? (
                        <div>
                            <hr/>
                            <div className="spread-horizontal">
                                <div></div>
                                <ButtonPrimary onClick={() => {
                                    FlowRouter.go('finalize-event', {eventId: eventId})
                                }}>
                                    Zeitpunkt festmachen
                                </ButtonPrimary>
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
