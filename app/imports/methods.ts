import { Meteor } from 'meteor/meteor'

import { EventsCollection, Event, Participant } from '/imports/api/events'
import { hasParticipantTimeslot, roundTime, eventUrl, isEmailValid } from '/imports/util'

import { sendMail } from '/imports/notify'

const maximumTimeslots = 4
const maximumParticipants = 15

Meteor.methods({
    'events.create': (event:Event) => {
        if (!event){
            throw new Meteor.Error(500, 'No event given.')
        }
        if (event.participants.length > 1){
            throw new Meteor.Error(500, 'There can only be a single event author.')
        }
        event.participants.forEach((participant, i) => {
            if(participant.timeslots.length > maximumTimeslots) {
                throw new Meteor.Error(500, 'Only 4 timeslots allowed per person.')
            }

            // round all timeslots before inserting
            const roundedTimeslots = participant.timeslots.map((timeslot) => {
                return roundTime(timeslot)
            })
            event.participants[i].timeslots = roundedTimeslots

        })
        const eventId = EventsCollection.insert(event)
        const fromMail = Meteor.settings.public.from_email
        sendMail({
            to: event.authorEmail,
            from: fromMail ? fromMail : event.authorEmail,
            subject: 'Glückwunsch, dein Event wurde angelegt!',
            text: `Das Event mit dem Titel ${event.title} wurde erfolgreich angelegt. Bearbeite es oder lade Freunde ein unter ${eventUrl(eventId)}`,
            html: `<h1>${event.title}</h1><p>Das Event mit dem Titel <strong>${event.title}</strong> wurde erfolgreich angelegt.</p><p>Bearbeite es oder lade Freunde ein unter <a href="${eventUrl(eventId)}">${eventUrl(eventId)}</a></p>`,
        })
        return eventId
    },

    'events.get': (eventId:string) => {
        return EventsCollection.findOne({_id: eventId})
    },

    'events.toggleTimeslot': ({eventId, userEmail, timeslot}:{eventId:string, userEmail:string, timeslot:Date}) => {
        const event = EventsCollection.findOne({_id: eventId})
        if (!event) {
            throw new Meteor.Error(500, 'Event not found.')
        }

        const participantResult = event.participants?.filter(participant => participant.email == userEmail)
        const participant = participantResult?.length === 1 ? participantResult[0] : null
        if (!participant) {
            throw new Meteor.Error(500, 'Participant not found.')
        }

        // add or pull timeslot from participant based on current inclusion
        const operation = hasParticipantTimeslot(event.participants, userEmail, timeslot) ? "$pull" : "$addToSet"
        EventsCollection.update({
            _id: eventId,
            'participants.email': participant.email
        }, {[`${operation}`]: {'participants.$.timeslots': roundTime(timeslot)}})

        return true
    },

    'events.addParticipant': ({eventId, participant}:{eventId:string, participant:Participant}) => {
        if(!participant) {
            throw new Meteor.Error(500, 'No participant given.')
        }
        const event = EventsCollection.findOne({_id: eventId})
        if(!event) {
            throw new Meteor.Error(500, 'Event not found.')
        }

        // limit to keep events manageable, might increase later
        const participantCount = event.participants?.length
        if(participantCount && participantCount >= maximumParticipants) {
            throw new Meteor.Error(500, 'Only `${maximumParticipants}` participants allowed per event.')
        }

        const alreadyExists = EventsCollection.findOne({_id: eventId, 'participants.email': participant.email?.toLowerCase()})
        if(alreadyExists) {
            throw new Meteor.Error(500, 'Participant already exists.')
        }

        EventsCollection.update({_id: eventId}, {$addToSet: {'participants': participant}})
        return true
    },

    'events.finalize': ({eventId, finalDate}:{eventId:string, finalDate:Date}) => {
        const event = EventsCollection.findOne({_id: eventId})
        if (!event) {
            throw new Meteor.Error(500, 'Event not found.')
        }

        EventsCollection.update({_id: eventId}, {$set: {
            final: true,
            finalDate
        }})

        const fromMail = Meteor.settings.public.from_email
        return
        event.participants?.forEach((participant) => {
            if(isEmailValid(participant.email)) {
                sendMail({
                    to: participant.email,
                    from: fromMail ? fromMail : event.authorEmail,
                    subject: `${event.authorName} hat das Event "${event.title}" finalisiert!`,
                    text: `${event.title} findet zur folgenden Zeit statt: ${event.finalDate}. Treffpunkt ist: ${event.space}. Link zum Event: ${eventUrl(eventId)}`,
                    html: `${event.title} findet zur folgenden Zeit statt: ${event.finalDate}. <br>Treffpunkt ist: ${event.space}. <br><br>Link zum Event: ${eventUrl(eventId)}`,
                })
            } else {
                console.warn('Invalid email', participant.email)
            }
        })
        return true
    }
})
