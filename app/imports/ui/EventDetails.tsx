import React from 'react'
import { formatDateTime, eventUrl } from '/imports/util'
import { Participant } from '/imports/api/events'
import CalendarLink from '/imports/ui/CalendarLink'
import { WhatsappShareButton } from 'react-share'

interface EventDetailsProps {
    eventId:string
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
            {(props.final && props.finalDate) ? (
                <div>
                    <span>
                        <strong>Zeit</strong>: {''+formatDateTime(props.finalDate)}
                    </span>
                    <CalendarLink title={props.title}
                                  start={props.finalDate}
                                  duration={[1, 'hour']}
                                  space={props.space}
                                  description={props.description}
                                  url={eventUrl('eventId')} />
                </div>
            ) : null}
            <p>
                <strong>Beschreibung</strong>: {props.description}
            </p>
            <p>
                <strong>Raum</strong>: {props.space}
            </p>
            <WhatsappShareButton title={`Einladung zu ${props.title}`}
                                 url={window.location}>
                <a href="#">Per WhatsApp teilen</a>
            </WhatsappShareButton>
        </div>
    )
}

export default EventDetails
