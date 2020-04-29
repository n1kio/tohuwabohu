import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Layout } from '/imports/ui/Layout'

const Dashboard = () => (
    <Layout>
        <h1>Willkommen im Online Freizeit Organisator!</h1>
        <button onClick={() => {FlowRouter.go('new-event')}}> Event erstellen</button>
    </Layout>
)

export default Dashboard
