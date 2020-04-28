import React, { ReactNode } from 'react'
import styled from 'styled-components'

interface LayoutProps {
    children: ReactNode
}

const HeaderStyle = styled.div`
    padding: 10px 0;
    margin: 0;
    background-color: lightgrey;
    font-weight: bold;
    text-align: center;
`

const Header = () => {
    return <HeaderStyle>
        Freizeit Planer
    </HeaderStyle>
}

const Layout = (props : LayoutProps) => (
    <div>
        <Header/>
        <div>{props.children}</div>
    </div>
)

export {
    Layout
}
