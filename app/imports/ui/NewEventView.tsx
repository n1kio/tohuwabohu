import React, { useState } from 'react'
import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import swal from 'sweetalert'

import { Layout } from '/imports/ui/Layout'
import { Button, Input } from '/imports/ui/Primitives'

const NewEventView = () => {
    const [authorEmail, setAuthorEmail] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [space, setSpace] = useState('')
    return (
        <Layout>
            <h1>Neues Event erstellen</h1>

            <form onSubmit={(e) => {e.preventDefault()}}>
                <h2>Deine E-Mail Adresse</h2>
                <Input onChange={(e) => {setAuthorEmail(e.target.value)}} type="email" />

                <h2>Titel des Events</h2>
                <Input onChange={(e) => {setTitle(e.target.value)}} type="text" />

                <h2>Beschreibung des Events</h2>
                <Input onChange={(e) => {setDescription(e.target.value)}} type="text" />

                <h2>Raum des Events</h2>
                <Input onChange={(e) => {setSpace(e.target.value)}} type="text" />

                <Button onClick={() => {
                    Meteor.call('events.create', {
                        authorEmail,
                        title,
                        description,
                        space
                    }, (err, res) => {
                        if(err) {
                            swal(err)
                        } else {
                            console.log(res)
                            FlowRouter.go('event', {eventId: res})
                            swal('Yay!', 'Event erfolgreich angelegt!', 'success')
                        }
                    })
                }}>Erstellen</Button>
            </form>

        </Layout>
    )
}

export default NewEventView
