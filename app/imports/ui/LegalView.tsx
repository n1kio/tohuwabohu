import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Layout } from '/imports/ui/Layout'
import { ButtonPrimary } from '/imports/ui/Primitives'

const LegalView = () => {
    return (
        <Layout>
            <h1>Angaben gemäß § 5 TMG:</h1>
            <p>
                Niklas Appelmann / Software und Beratung
            </p>
            <p>
                Amselweg 46
            </p>
            <p>
                64295 Darmstadt
            </p>
            <p>
                E-Mail: niklasappelmann at gmail dot com
            </p>
            <p>
                Telefon: ‭+49 151 64690684‬
            </p>
            <ButtonPrimary onClick={() => {history.back()}}>zurück</ButtonPrimary>
        </Layout>
    )
}

export default LegalView
