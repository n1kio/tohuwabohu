import { Event } from '/imports/api/events'

const listTimeslots = (event : Event) => {
    event.participants.reduce((acc, participant) => {return acc.concat(participant)})
    return event.participants[0].timeslots
}

export { listTimeslots }
