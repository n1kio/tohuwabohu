import { Mongo } from 'meteor/mongo'

interface Participant {
    name: string
    email: string
    timeslots: [Date]
}

interface Event {
    _id?: string
    title?: string
    space?: string
    authorId?: string
    authorEmail?: string
    authorName?: string
    description?: string
    participants?: [Participant]
    createdAt?: Date
}

const EventsCollection = new Mongo.Collection<Event>('events')

export {EventsCollection, Event, Participant}
