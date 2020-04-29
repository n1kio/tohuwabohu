import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import Swal from 'sweetalert2'
import DatePicker from 'react-datepicker'
import ls from 'local-storage'

import { Layout } from '/imports/ui/Layout'
import { Button, FullInput } from '/imports/ui/Primitives'
import { Event } from '/imports/api/events'

const NewEventView = () => {
    const [authorName, setAuthorName] = useState('')
    const [authorEmail, setAuthorEmail] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [space, setSpace] = useState('')
    const [authorTimeslots, setAuthorTimeslots] = useState([])

    return (
        <Layout>
            <h1>Neues Event erstellen</h1>

            <form onSubmit={(e) => {e.preventDefault()}}>
                <h2>Dein Name</h2>
                <FullInput onChange={(e : any) => {setAuthorName(e.target.value)}} type="text" />

                <h2>Deine E-Mail Adresse</h2>
                <FullInput onChange={(e : any) => {setAuthorEmail(e.target.value)}} type="email" />

                <h2>Titel des Events</h2>
                <FullInput onChange={(e : any) => {setTitle(e.target.value)}} type="text" />

                <h2>Beschreibung des Events</h2>
                <FullInput onChange={(e : any) => {setDescription(e.target.value)}} type="text" />

                <h2>Raum des Events</h2>
                <FullInput onChange={(e : any) => {setSpace(e.target.value)}} type="text" />

                <h2>Terminvorschläge (maximal 4)</h2>
                <Button onClick={() => {
                    setAuthorTimeslots(authorTimeslots.concat(new Date()))
                }} disabled={authorTimeslots.length >= 4}>+ Vorschlag</Button>

                {authorTimeslots.map((slot, i) => {
                    return <DatePicker
                               key={i}
                               selected={slot}
                               onChange={date => {
                                   const nextAuthorTimeslots = authorTimeslots.map((currentSlot, j) => {
                                       if(i === j) {
                                           return date
                                       }
                                       return currentSlot
                                   })
                                   setAuthorTimeslots(nextAuthorTimeslots)
                               }}
                               showTimeSelect
                               timeFormat="HH:mm"
                               timeIntervals={15}
                               timeCaption="time"
                               minDate={new Date()}
                               dateFormat="MMMM d, yyyy HH:mm"
                    />
                })}

                <hr/>

                <Button onClick={() => {
                    // store session user as author
                    ls('userEmail', authorEmail)

                    // create event
                    let event : Event = {
                        authorEmail,
                        authorName,
                        title,
                        description,
                        space,
                        participants: [{
                            name: authorName,
                            email: authorEmail,
                            timeslots: authorTimeslots
                        }]
                    }
                    Meteor.call('events.create', event, (err, res) => {
                        if(err) {
                            Swal.fire({
                                title: err,
                                icon: 'error'
                            })
                        } else {
                            FlowRouter.go('event', {eventId: res})
                            Swal.fire({
                                icon: 'success',
                                title: 'Event erfolgreich angelegt!',
                                timer: 1000,
                                showConfirmButton: false
                            })
                        }
                    })
                }}>Erstellen</Button>
            </form>

        </Layout>
    )
}

export default NewEventView
