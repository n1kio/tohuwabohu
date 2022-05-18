import React from 'react'
import { formatDateTime, eventUrl } from '/imports/util'
import { Participant } from '/imports/api/events'
import CalendarLink from '/imports/ui/CalendarLink'
import { WhatsappShareButton } from 'react-share'
import { Link, Stack, Heading, Text } from '@chakra-ui/core'

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
        <Stack spacing={4}>
            <Heading as="h2" size="lg">
                {props.title}
            </Heading>
            {(props.final && props.finalDate) ? (
                <Stack>
                    <Text>
                        <strong>Zeit</strong>: {''+formatDateTime(props.finalDate)}
                    </Text>
                    <CalendarLink title={props.title}
                                  start={props.finalDate}
                                  duration={[1, 'hour']}
                                  space={props.space}
                                  description={props.description}
                                  url={eventUrl('eventId')} />
                </Stack>
            ) : null}
            <Text>
                <strong>Beschreibung</strong>: {props.description}
            </Text>
            <Text>
                <strong>Treffpunkt</strong>: {props.space}
            </Text>
            <WhatsappShareButton title={`Einladung zu ${props.title}`}
                                 url={window.location}>
                <Link href="#">Per WhatsApp teilen</Link>
            </WhatsappShareButton>
        </Stack>
    )
}

export default EventDetails
