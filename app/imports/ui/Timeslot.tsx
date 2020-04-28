import React from 'react'
import styled from 'styled-components'

interface TimeslotProps {
    datetime : Date
    acceptCb : Function
    denyCb : Function
}

const TimeslotStyle = styled.div`
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: lightgrey
`

const Timeslot = (props : TimeslotProps) => {
    return (
        <TimeslotStyle>
            <h3>{'' + props.datetime}</h3>
            <button>JA</button>
            <button>NEIN</button>
        </TimeslotStyle>
    )
}

export default Timeslot
