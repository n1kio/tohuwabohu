import React from 'react'
import styled from 'styled-components'
import colors from '/imports/ui/Colors'

const Base = styled.div`
    padding: 10px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    display: inline;
    border-radius: 5px;
    border: 1px solid ${colors.medium};
    font-size: 1rem;
    cursor: pointer;
`

const Button = styled(Base)``

const ButtonPrimary = styled(Base)`
    background-color: ${colors.primary};
    color: ${colors.light};
`

const FullInput = styled.input`
    display: block;
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid ${colors.medium};
    box-sizing: border-box;
    min-height: 50px;
    text-align: center;
`

const Input = styled.input`
    margin-right: 10px;
`

export {
    Base,
    Button,
    Input,
    FullInput,
    ButtonPrimary,
    ButtonSuccess
}
