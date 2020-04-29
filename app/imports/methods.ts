import { Meteor } from 'meteor/meteor'

import { EventsCollection, Event } from '/imports/api/events'

const maximumTimeslots = 4

Meteor.methods({
    'events.create': (event : Event) => {
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
    },

    'events.toggleTimeslot': ({eventId, userEmail, timeslot} : {eventId : string, userEmail : string, timeslot : Date}) => {
        const event = EventsCollection.findOne({_id: eventId})
        if (!event) {
            throw new Meteor.Error(500, 'Event not found.')
        }

        const participantResult = event.participants.filter(participant => participant.email == userEmail)
        const participant = participantResult.length === 1 ? participantResult[0] : null
        if (!participant) {
            throw new Meteor.Error(500, 'Participant not found.')
        }

        // add or pull timeslot from participant based on current inclusion
        const operation = participant.timeslots.includes(timeslot) ? "$pull" : "$addToSet"
        EventsCollection.update({
            _id: eventId,
            'participants.email': participant.email
        }, {[`${operation}`]: {'participants.$.timeslots': timeslot}})

        return true
    }
})
