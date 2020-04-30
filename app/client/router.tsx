import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { mount } from 'react-mounter'

import App from '/imports/ui/App'
import Dashboard from '/imports/ui/Dashboard'
import EventView from '/imports/ui/EventView'
import NewEventView from '/imports/ui/NewEventView'
import FinalizeEventView from '/imports/ui/FinalizeEventView'

FlowRouter.route('/', {
    name: 'root',
    action() {
        mount(App, {
            content: <Dashboard/>
        })
    }
})

FlowRouter.route('/new', {
    name: 'new-event',
    action() {
        mount(App, {
            content: <NewEventView/>
        })
    }
})

FlowRouter.route('/e/:eventId', {
    name: 'view-event',
    action() {
        mount(App, {
            content: <EventView/>
        })
    }
})

FlowRouter.route('/e/:eventId/finalize', {
    name: 'finalize-event',
    action() {
        mount(App, {
            content: <FinalizeEventView/>
        })
    }
})
