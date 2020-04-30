import React from 'react'
import styled from 'styled-components'
import colors from '/imports/ui/Colors'

const Base = styled.div`
    padding: 10px 15px;
    text-align: center;
    margin-top: 10px;
    margin-bottom: 10px;
    display: inline;
    border-radius: 5px;
    border: 1px solid ${colors.medium};
    font-size: 1rem;
    cursor: pointer;
    color: ${colors.dark};
`

const Button = styled(Base)`
`

const ButtonDisabled = styled(Base)`
    background-color: none;
    color: ${colors.medium};
    cursor: default;
    font-weight: bold;
`

const ButtonDarkBg = styled(Button)`
    color: ${colors.dark};
    background-color: ${colors.light};
`

const FullButton = styled(Base)`
    width: 100%;
    display: block;
`

const ButtonPrimary = styled(Base)`
    background-color: ${colors.primary};
    color: ${colors.light};
    font-weight: bold;
`

const ButtonSuccess = styled(Base)`
    background-color: ${colors.success};
    color: ${colors.light};
    font-weight: bold;
`

const Input = styled.input`
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 10px;
    font-size: 1rem;

    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid ${colors.medium};

`

const FullInput = styled(Input)`
    display: block;
    width: 100%;
    border-radius: 5px;
    border: 1px solid ${colors.medium};
    box-sizing: border-box;
    text-align: center;
`

const Select = styled.select`
    margin-right: 10px;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    background-color: ${colors.light};
    border: 1px solid ${colors.medium};
    border-radius: 5px;
    box-sizing: border-box;
    font-size: 1rem;
`


export {
    Base,
    Button,
    Input,
    FullInput,
    FullButton,
    ButtonDarkBg,
    ButtonPrimary,
    ButtonSuccess,
    ButtonDisabled,
    Select
}
