import React, { useState } from 'react'
import ls from 'local-storage'
import Swal from 'sweetalert2'
import styled from 'styled-components'

import colors from '/imports/ui/Colors'
import { Participant } from '/imports/api/events'
import { FullButton, Button, FullInput } from '/imports/ui/Primitives'

interface UserSelectionProps {
    participants: [Participant]
    selected?: string
    eventId?: string
    changeCb: Function
}

const Select = styled.select`
    margin-right: 10px;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: ${colors.light};
    border: 1px solid ${colors.medium};
    border-radius: 5px;
    min-height: 50px;
    font-size: 1rem;
    box-sizing: border-box;
`

const UserSelection = (props : UserSelectionProps) => {
    const [selected, setSelected] = useState(props.selected)
    const [showAdd, setShowAdd] = useState<Boolean>(false)
    const [newName, setNewName] = useState<string>('')
    const [newEmail, setNewEmail] = useState<string>('')
    const changeCb = props.changeCb

    return (
        <div>
            <span>Du bist </span>
            <Select type="dropdown" value={selected || ''} onChange={(e) => {
                const newUserEmail = e.target.value
                setSelected(newUserEmail)
                ls('userEmail', newUserEmail)
                changeCb(newUserEmail)
            }}
            >
                {!ls('userEmail') ? (
                    <option value="">Namen wählen</option>
                ) : null}
                {props.participants?.map((participant, i) => {
                    return (
                        <option key={i} value={participant.email}>
                            {participant.name}
                        </option>
                    )
                })}
            </Select>
            {showAdd ? (
                <div>
                    <FullInput placeholder="Name"
                               type="text"
                               value={newName}
                               onChange={(e) => {
                                   setNewName(e.target.value)
                               }} />
                    <FullInput placeholder="E-Mail Adresse"
                               type="email"
                               value={newEmail}
                               onChange={(e) => {
                                   setNewEmail(e.target.value)
                               }} />
                    <FullButton onClick={() => {
                        const participant = {
                            name: newName,
                            email: newEmail
                        }
                        if([newName, newEmail].includes('')) {
                            Swal.fire({
                                text: 'Bitte Namen und E-Mail Adresse für neue Teilnehmer angeben.',
                                icon: 'warning'
                            })
                            return false
                        }
                        Meteor.call('events.addParticipant', {eventId: props.eventId, participant}, (err) => {
                            if(err) {
                                Swal.fire({
                                    title: 'Konnte Vorschlag nicht hinzufügen.',
                                    text: err,
                                    icon: 'error'
                                })
                            } else {
                                setShowAdd(false)
                                setNewName('')
                                setNewEmail('')
                                changeCb()
                                Swal.fire({
                                    icon: 'success',
                                    title: `${participant.name} hinzugefügt.`,
                                    timer: 1000,
                                    showConfirmButton: false
                                })
                            }
                        })
                    }}>
                        Teilnehmer hinzufügen
                    </FullButton>
                    <FullButton onClick={()=>{
                        setShowAdd(false)
                        setNewName('')
                        setNewEmail('')
                    }}>
                        abbrechen
                    </FullButton>
                </div>
            ) : (
                <Button onClick={()=>{
                    setShowAdd(true)
                }}>+</Button>
            )}

        </div>
    )
}

export default UserSelection
