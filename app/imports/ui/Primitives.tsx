import React from 'react'
import styled from 'styled-components'
import colors from '/imports/ui/Colors'

const Button = styled.button`
    margin-right: 10px;
    cursor: pointer;
`

const FullButtonStyle = styled.div`
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    text-align: center;
    border: 1px solid;
    border-radius: 5px;
    box-shadow: 1px 1px 1px ${colors.dark};
    cursor: pointer;
    background-color: ${props => props.primary ? colors.green : 'inherit'};
    color: ${props => props.primary ? colors.light : 'inherit'};
`

const FullButton = (props) => {
    return <FullButtonStyle {...props}>
        {props.children}{props.value}
    </FullButtonStyle>
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
    margin-right: 10px;
`

const Select = styled.select`
    margin-right: 10px;
    margin-bottom: 10px;
`

export {
    Button,
    FullButton,
    Input,
    FullInput,
    Select
}
