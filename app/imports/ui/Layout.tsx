import React, { ReactNode } from 'react'

interface LayoutProps {
    children: ReactNode
}

const Layout = (props : LayoutProps) => (
    <div>{props.children}</div>
)

export {
    Layout
}
