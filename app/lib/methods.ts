import { Meteor } from 'meteor/meteor'

import { EventsCollection, Event } from '/imports/api/events'

Meteor.methods({
    'events.create': (event : Event) => {
        console.log('Inserting event:', event)
        return EventsCollection.insert(event)
    },

    'events.get': (eventId : string) => {
        return EventsCollection.findOne({_id: eventId})
    }
})
