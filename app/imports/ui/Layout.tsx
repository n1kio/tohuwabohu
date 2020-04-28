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

const FooterStyle = styled.div``
const Footer = () => {
    return <FooterStyle>
    </FooterStyle>
}

const Container = styled.div`
    max-width: 1000px;
    margin: auto;
    padding: 0 15px;
`

const Layout = (props : LayoutProps) => (
    <div>
        <Header/>
        <Container>
            {props.children}
        </Container>
        <Footer/>
    </div>
)

export {
    Layout
}
