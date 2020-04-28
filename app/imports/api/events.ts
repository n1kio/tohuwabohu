import { Mongo } from 'meteor/mongo'

interface Event {
    _id?: string
    title: string
    space?: string
    authorId: string
    authorEmail: string
    authorName?: string
    description: string
    createdAt: Date
}

const EventsCollection = new Mongo.Collection<Event>('events')

export {EventsCollection, Event}
