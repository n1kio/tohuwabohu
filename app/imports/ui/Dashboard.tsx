import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'

import { Layout } from '/imports/ui/Layout'
import { ButtonPrimary } from '/imports/ui/Primitives'

const Dashboard = () => (
    <Layout>
        <div className="spaced">
            <ButtonPrimary onClick={() => {FlowRouter.go('new-event')}}>Direkt loslegen</ButtonPrimary>
        </div>
        <hr/>
        <h1>Einfach Online Freizeit organisieren!</h1>
        <p>
            Ein Treffen mit vielen Personen zu organisieren kann anstrengend sein.
        </p>
        <p>
            Häufig ist es nicht nur eine Herausforderung einen passenden Tag für ein Treffen zu finden, sondern auch einen geeigneten Treffpunkt auszumachen. Viele Personen bedeutet oft viele unterschiedliche Terminkalender, Lebenssituationen und Präferenzen.
        </p>
        <p>
            Die Corona-Pandemie hat außerdem dazu geführt, dass typische physische Treffpunkte durch virtuelle Alternativen ersetzt werden müssen. WhatsApp-Gruppen, Doodle-Listen oder E-Mail-Verteiler können dieses Problem zwar lösen, aber es ist umständlich und sind keine speziellen Lösungen für das eigentliche Problem: Einfach und intuitiv eine Zeit und einen Ort für ein Treffen mit Freunden zu finden.
        </p>
        <p>
            Mithilfe von TOHUWABOHU kann ein Online-Gruppentreffen nun leicht und verständlich umgesetzt werden.
        </p>
        <div className="spaced">
            <ButtonPrimary onClick={() => {FlowRouter.go('new-event')}}>Event erstellen</ButtonPrimary>
        </div>
    </Layout>
)

export default Dashboard
