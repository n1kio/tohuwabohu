import { ThemeProvider, theme, CSSReset } from "@chakra-ui/core"
import React, { ReactNode } from 'react'

interface RouteProps {
    content?: ReactNode
}

const App = (props: RouteProps) => {
    return (
        <ThemeProvider theme={theme}>
            <CSSReset />
            {props.content || null}
        </ThemeProvider>
    )
}

export default App
