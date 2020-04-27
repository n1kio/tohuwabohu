import { ReactNode } from 'react'

interface RouteProps {
    content: ReactNode
}

const App = (props: RouteProps) => (
    props.content
)

export default App
