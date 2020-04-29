import React from 'react'
import styled from 'styled-components'

const Button = styled.button`
    margin: 0 10px;
    cursor: pointer;
`

const FullButtonStyle = styled.div`
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
    border: 1px solid;
    border-radius: 5px;
    box-shadow: 1px 1px 1px black;
    cursor: pointer;
`

const FullButton = (props) => {
    return <FullButtonStyle onChange={props.onChange}>{props.children}{props.value}</FullButtonStyle>
}

const FullInput = styled.input`
    display: block;
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    text-align: center;
    width: 100%;
`

const Input = styled.input`
`

const Select = styled.select`
`

export {
    Button,
    FullButton,
    Input,
    FullInput,
    Select
}
