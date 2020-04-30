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
    padding: 10px;
    margin-bottom: 20px;
    background-image: url('/header.jpg');
    background-size: cover;
    background-color: ${colors.medium};
    box-sizing: border-box;
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

const FooterStyle = styled.div`
    padding: 5px 0;
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
    background-color: ${colors.medium}
`
const Footer = () => {
    return <FooterStyle>
        Made with ♥ in Darmstadt
    </FooterStyle>
}

const Container = styled.div`
    max-width: 1000px;
    margin: auto;
    padding: 0 15px;
    padding-bottom: 2.5rem;
`

const PageContainer = styled.div`
    position: relative;
    min-height: 100vh
`

const Layout = (props : LayoutProps) => (
    <PageContainer>
        <Header/>
        <Container>
            {props.children}
        </Container>
        <Footer/>
    </PageContainer>
)

export {
    Layout
}
