import React from 'react'
import styled from 'styled-components'
import colors from '/imports/ui/Colors'

const Button = styled.button`
    margin-right: 10px;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    border: 1px solid;
    border-radius: 5px;
    background-color: ${colors.light};
    min-height: 50px;
    font-size: 1rem;
    /* box-shadow: 1px 1px 1px ${colors.dark}; */
`

const FullButtonStyle = styled(Button)`
    background-color: ${props => props.primary ? colors.primary : 'inherit'};
    color: ${props => props.primary ? colors.light : 'inherit'};
    display: block;
    width: 100%;
`

const FullButton = (props) => {
    return <FullButtonStyle {...props}>
        {props.children}{props.value}
    </FullButtonStyle>
}

const FullInput = styled.input`
    display: block;
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    text-align: center;
`

const Input = styled.input`
    margin-right: 10px;
`

export {
    Button,
    FullButton,
    Input,
    FullInput
}
