import React, { ReactNode } from 'react'
import styled from 'styled-components'
import colors from '/imports/ui/Colors'

interface LayoutProps {
    children: ReactNode
}

const HeaderStyle = styled.div`
    @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap');
    font-family: 'Fredoka One', sans-serif;
    font-size: 1.5rem;
    padding: 10px 0;
    margin: 0;
    background-image: url('/header.jpg');
    background-size: cover;
    background-color: ${colors.medium};
    color: ${colors.light};
    text-align: center;
    a {
        color: ${colors.light};
        text-decoration: none;
    }
`

const Header = () => {
    return <HeaderStyle>
        <a href="/">TOHUWABOHU</a>
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
