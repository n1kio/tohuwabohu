import React from 'react'
import styled from 'styled-components'
import { google } from "calendar-link"

interface CalendarLinkProps {
    title:string
    description:string
    start:Date
    space:string
    end?:Date
    duration?:Array<number|string>
    url:string
}

const CalendarLinkStyled = styled.span`
    margin: 10px;
`

const CalendarLink = (props:CalendarLinkProps) => {
    const event = {
        title: props.title,
        description: props.description,
        start: props.start,
        location: props.space,
        duration: props.duration,
        end: props.end,
        url: props.url
    }
    return (
        <CalendarLinkStyled>
            <a href={google(event)}>Zu Google Kalendar hinzufügen</a>
        </CalendarLinkStyled>
    )
}

export default CalendarLink
