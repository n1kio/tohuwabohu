import React from 'react'
import { Meteor } from 'meteor/meteor'
import { render } from 'react-dom'
import "react-datepicker/dist/react-datepicker.css"

import './router'
import '/imports/methods'
import '/imports/serviceWorker'

import App from '/imports/ui/App'

Meteor.startup(() => {
    render(<App />, document.getElementById('react-target'))
})
