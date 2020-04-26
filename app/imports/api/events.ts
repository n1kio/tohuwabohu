import { Mongo } from 'meteor/mongo'

export interface Event {
    _id?: string
    title: string
    url: string
    author: string
    createdAt: Date
}

export const EventsCollection = new Mongo.Collection<Event>('events')
