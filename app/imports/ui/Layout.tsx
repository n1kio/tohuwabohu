import React, { ReactNode } from 'react'

interface LayoutProps {
    children: ReactNode
}

const Header = () => {
    return <div>
    </div>
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
