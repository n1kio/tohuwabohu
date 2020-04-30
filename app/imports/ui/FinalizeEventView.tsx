import React, { useEffect } from 'react'
import Swal from 'sweetalert2'
import { EventsCollection } from '/imports/api/events'
import { withTracker } from 'meteor/react-meteor-data'
import { FlowRouter } from 'meteor/kadira:flow-router'
import ls from 'local-storage'

import { Layout } from '/imports/ui/Layout'
import EventDetails from '/imports/ui/EventDetails'
import { defaultText } from '/imports/util'
import { Button } from '/imports/ui/Primitives'
import { AvailableTimeslots } from '/imports/ui/Timeslot'

const finalize = (eventId:string, finalDate:Date) => {
    Swal.fire({
        title: 'Möchtest du das Event finalisieren?',
        text: 'Diese Aktion kann nicht rückgängig gemacht werden!',
        showCancelButton: true,
        cancelButtonText: 'Abbrechen',
        confirmButtonText: 'Ja, weiter!'
    }).then((res) => {
        if (res.value) {
            Meteor.call('events.finalize', {eventId, finalDate}, (err) => {
                if(err) {
                    Swal.fire({
                        icon: 'error',
                        title: `Event konnte nicht finalisiert werden.`,
                        text: err
                    })
                } else {
                    FlowRouter.go('view-event', {eventId})
                    Swal.fire({
                        icon: 'success',
                        title: `Event wurde finalisiert`,
                        timer: 1000,
                        showConfirmButton: false
                    })
                }
            })
        }
    })
}

const FinalizeEventView = (props) => {
    const event = props.event
    const eventId = FlowRouter.getParam('eventId')
    const userEmail = ls('userEmail')

    useEffect(() => {
        Meteor.subscribe('event', eventId)
    }, [])

    return (
        <Layout>
            {event ? (
                <div>
                    <h1>Event finalisieren</h1>
                    <EventDetails title={defaultText(event.title)}
                                  description={defaultText(event.description)}
                                  space={defaultText(event.space)}
                    />
                    <h2>Wähle einen finalen Zeitpunkt</h2>
                    <p>
                        Um den Zeitpunkt des Events zu finalisieren kannst du hier einen Zeitpunkt auswählen an dem das virtuelle Treffen stattfinden soll.
                    </p>

                    <AvailableTimeslots plain={true}
                                        event={event}
                                        userEmail={userEmail}
                                        onClickCb={(finalDate) => {
                                            finalize(eventId, finalDate)
                                        }} />

                    <div className="spread-horizontal">
                        <Button onClick={() => {
                            FlowRouter.go('view-event', {eventId})
                        }}>abbrechen</Button>
                    </div>
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
})(FinalizeEventView)
