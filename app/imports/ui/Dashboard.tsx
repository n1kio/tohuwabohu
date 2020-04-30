import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Layout } from '/imports/ui/Layout'
import { Button } from '/imports/ui/Primitives'

const Dashboard = () => (
    <Layout>
        <h1>Willkommen im Online Freizeit Organisator!</h1>
        <Button onClick={() => {FlowRouter.go('new-event')}}> Event erstellen</Button>
    </Layout>
)

export default Dashboard
