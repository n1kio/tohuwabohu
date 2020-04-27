import React from 'react'

import { Layout } from '/imports/ui/Layout'

const Dashboard = () => (
    <Layout>
        <h1>Willkommen im Freizeit Planer!</h1>
        <button onClick={() => {alert('Ich kann noch nix :D')}}> Event erstellen</button>
    </Layout>
)

export default Dashboard
