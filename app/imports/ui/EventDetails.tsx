import React from 'react'
import { formatDateTime } from '/imports/util'

interface EventDetailsProps {
    title:string
    description:string
    space:string
    finalDate?:Date
    final?:boolean
}

const EventDetails = (props:EventDetailsProps) => {
    return (
        <div>
            <p><strong>Titel</strong>: {props.title}</p>
            <p><strong>Beschreibung</strong>: {props.description}</p>
            <p><strong>Raum</strong>: {props.space}</p>
            {(props.final && props.finalDate) ? <p><strong>Zeit</strong>: {''+formatDateTime(props.finalDate)} Uhr</p> : null}
        </div>
    )
}

export default EventDetails
