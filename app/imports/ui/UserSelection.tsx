import React, { useState } from 'react'
import ls from 'local-storage'
import Swal from 'sweetalert2'

import { Participant } from '/imports/api/events'
import { Button, Select, Input, Text, Link, Stack } from '@chakra-ui/core'

interface UserSelectionProps {
  participants:[Participant]
  selected?:string
  eventId?:string
  changeCb:Function
}

const UserSelection = (props : UserSelectionProps) => {
  const [selected, setSelected] = useState(props.selected)
  const [showAdd, setShowAdd] = useState<Boolean>(false)
  const [newName, setNewName] = useState<string>('')
  const [newEmail, setNewEmail] = useState<string>('')
  const changeCb = props.changeCb

  if (!showAdd) {
    return (
      <Stack isInline>
        <Select value={selected || ''} onChange={(e) => {
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
        <Button variant="ghost" onClick={() => {
          setShowAdd(true)
        }}>
          {!selected ? "oder " : "+ " } Teilnehmer hinzufügen
        </Button>
      </Stack>
    )
  } else {
    return (
      <Stack>
        <Text>Neuen Teilnehmer zum Event hinzufügen</Text>
        <Stack>
          <Input placeholder="Name"
                 type="text"
                 value={newName}
                 onChange={(e) => {
                   setNewName(e.target.value)
                 }}
          />
          <Input placeholder="E-Mail Adresse"
                 type="email"
                 value={newEmail}
                 onChange={(e) => {
                   setNewEmail(e.target.value)
                 }} />
        </Stack>
        <Stack isInline>
          <Button onClick={() => {
            setShowAdd(false)
            setNewName('')
            setNewEmail('')
          }}>
            abbrechen
          </Button>
          {newName && newEmail ? (
            <Button variantColor="purple" onClick={() => {
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
            </Button>
              ) : <Button disabled={true} onClick={() => {
                Swal.fire({
                  title: 'Bitte Namen und E-Mail Adresse angeben.',
                  icon: 'info'
                })
              }}>
                speichern
              </Button>}
        </Stack>
      </Stack>

          )
  }
}

      export default UserSelection
