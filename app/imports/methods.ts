import { Meteor } from 'meteor/meteor'

import { EventsCollection, Event } from '/imports/api/events'

const maximumTimeslots = 4

Meteor.methods({
    'events.create': (event : Event) => {
        // TODO make all fields mandatory

        if (event.participants.length > 1){
            throw new Meteor.Error(500, 'There can only be a single event author.')
        }
        event.participants.forEach((participant) => {
            if(participant.timeslots.length > maximumTimeslots) {
                throw new Meteor.Error(500, 'Only 4 timeslots allowed per person.')
            }
        })
        return EventsCollection.insert(event)
    },

    'events.get': (eventId : string) => {
        return EventsCollection.findOne({_id: eventId})
    }
})
