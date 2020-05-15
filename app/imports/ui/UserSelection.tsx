import React, { useState } from 'react'
import ls from 'local-storage'
import Swal from 'sweetalert2'
import styled from 'styled-components'

import colors from '/imports/ui/Colors'
import { Participant } from '/imports/api/events'
import { Select, Button, ButtonDarkBg, ButtonDisabled, ButtonPrimary, FullInput } from '/imports/ui/Primitives'

interface UserSelectionProps {
    participants:[Participant]
    selected?:string
    eventId?:string
    changeCb:Function
}

const UserSelectionStyle = styled.div`
    background-color: ${colors.primary};
    padding: 5px 15px;
    border-radius: 5px;
    color: ${colors.light};
    span, p, a {
    font-weight: bold;
    }
    a {
    color: ${colors.light};
    text-decoration: none;
    }
    a:hover {
    text-decoration: underline;
    }
`

const UserSelection = (props : UserSelectionProps) => {
    const [selected, setSelected] = useState(props.selected)
    const [showAdd, setShowAdd] = useState<Boolean>(false)
    const [newName, setNewName] = useState<string>('')
    const [newEmail, setNewEmail] = useState<string>('')
    const changeCb = props.changeCb

    return (
        <UserSelectionStyle>
            {!showAdd ? (
                <div className="spread-horizontal">
                    <Select type="dropdown" value={selected || ''} onChange={(e) => {
                        const newUserEmail = e.target.value
                        setSelected(newUserEmail)
                        ls('userEmail', newUserEmail)
                        setShowAdd(false)
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
                    <a href="#" onClick={() => {
                        setShowAdd(true)
                    }}>
                        {!selected ? "oder " : "+ " } Teilnehmer hinzufügen
                    </a>
                </div>
            ) : null}

            {showAdd ? (
                <div>
                    <p>
                        Neuen Teilnehmer zum Event hinzufügen
                    </p>
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
                    <div className="spread-horizontal">
                        <ButtonDarkBg onClick={() => {
                            setShowAdd(false)
                            setNewName('')
                            setNewEmail('')
                        }}>
                            abbrechen
                        </ButtonDarkBg>
                        {newName && newEmail ? (
                            <ButtonPrimary onClick={() => {
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
                                Swal.fire({
                                    title: 'Bist du mit der Verarbeitung deiner Daten einverstanden?',
                                    text: 'Zum Anlegen eines Teilnehmers und zur Terminfindung speichern wir die von dir eingegebenen Daten. Darunter dein Name, deine E-Mail Adresse und von dir ausgewählte Zeitpunkte im Event.',
                                    showCancelButton: true,
                                    cancelButtonText: 'Abbrechen',
                                    confirmButtonText: 'Ja, ich bin einverstanden'
                                }).then((res) => {
                                    if(res.value) {
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
                                    }
                                }
                            }}>
                                speichern
                            </ButtonPrimary>

                                ) : <ButtonDisabled onClick={() => {
                                    Swal.fire({
                                        title: 'Bitte Namen und E-Mail Adresse angeben.',
                                        icon: 'info'
                                    })
                                }}>speichern</ButtonDisabled>}
                    </div>
                </div>
                        ) : null}

        </UserSelectionStyle>
            )
}

        export default UserSelection
