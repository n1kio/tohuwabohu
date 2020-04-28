import { ReactNode } from 'react'

interface RouteProps {
    content?: ReactNode
}

const App = (props: RouteProps) => (
    props.content || null
)

export default App
