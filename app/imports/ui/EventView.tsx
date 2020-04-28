import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Layout } from '/imports/ui/Layout'

const t = (s : string) => s

const EventView = () => {
    const [event, setEvent] = useState({
        title: t('Lade Titel...')
    })
    const eventId = FlowRouter.getParam('eventId')
    Meteor.call('events.get', eventId, (err, res) => {
        setEvent(res)
    })
    return (
        <Layout>
            <h1>Titel: {event.title}</h1>
            <p>Beschreibung: {event.description}</p>
            <p>Raum: {event.space}</p>
            <p>Link dieser Seite: {'' + window.location}</p>
        </Layout>
    )
}

export default EventView
