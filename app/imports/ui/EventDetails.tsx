import React from 'react'
import { formatDateTime } from '/imports/util'
import { Participant } from '/imports/api/events'

interface EventDetailsProps {
    title:string
    description:string
    space:string
    finalDate?:Date
    final?:boolean
    participants?:[Participant]
}

const EventDetails = (props:EventDetailsProps) => {
    return (
        <div>
            <h2>
                {props.title}
            </h2>
            <p>
                {(props.final && props.finalDate) ? <span><strong>Zeit</strong>: {''+formatDateTime(props.finalDate)} Uhr</span> : null}
            </p>
            <p>
                <strong>Beschreibung</strong>: {props.description}
            </p>
            <p>
                <strong>Raum</strong>: {props.space}
            </p>
        </div>
    )
}

export default EventDetails
