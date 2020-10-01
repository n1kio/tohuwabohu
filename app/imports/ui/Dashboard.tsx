import React from 'react'
import { FlowRouter } from 'meteor/kadira:flow-router'
import ls from 'local-storage'

import { Event } from '/imports/api/events'
import { Layout } from '/imports/ui/Layout'
import { ButtonPrimary, Spacer, Hero, ButtonSuccess, Flex } from '/imports/ui/Primitives'

const Dashboard = () => {
    const eventsVisited = ls('eventsVisited') ? ls('eventsVisited') : []
    return (
        <Layout>
            <Spacer/>
            <h1>Einfach Online-Freizeit organisieren!</h1>
            {eventsVisited.length > 0 ? (
                <Hero>
                    <h2>Zuletzt gesehen</h2>
                    <p>
                        Hier siehst du die letzten 10 Events, die du mit diesen Gerät besucht hast. Das neuste Event steht vorne.
                    </p>
                    <Flex>
                        {eventsVisited
                            .filter((x) => x.createdAt)
                            .sort((a, b) => { return a?.createdAt < b?.createdAt })
                            .slice(0, 10)
                            .map((event: Event) => (
                            <ButtonSuccess key={event._id} onClick={() => {FlowRouter.go('view-event', {eventId: event._id})}}>
                                {event.title}
                            </ButtonSuccess>
                        ))}
                    </Flex>
                </Hero>
            ) : null}

            <h2>In 3 einfachen Schritten zum Online-Treffen</h2>
            <ol>
                <li>Event erstellen</li>
                <li>Link an Freunde schicken</li>
                <li>Einen passenden Zeitpunkt terminieren</li>
            </ol>
            <div className="spaced">
                <ButtonPrimary onClick={() => {
                    FlowRouter.go('new-event')
                }}>Event erstellen</ButtonPrimary>
            </div>

            <h2>Gibt es so etwas nicht schon?</h2>
            <p>
                Der Unterschied zu anderen Tools liegt darin, dass die Terminfindung mit <b>tohuwabohu</b> nicht erfordert weit in die Zukunft sehen zu müssen. 🔮
            </p>
            <p>
                Als Organisator reicht es bereits ein paar wenige Zeitvorschläge zu machen. Die eingeladenen Teilnehmer können dann Vorschläge annehmen oder neue Vorschläge hinzufügen. Sobald ein Zeitpunkt gefunden wurde kann der Organisator den Zeitpunkt festmachen und alle Teilnehmer erhalten eine E-Mail als Bestätigung.
            </p>
            <h2>Hintergrund</h2>
            <p>
                Ein Treffen mit vielen Personen zu organisieren kann anstrengend sein und erfordert oftmals viel Absprache. Ein Treffen mit vielen Personen bedeutet auch viele unterschiedliche Terminkalendar, Lebenssituationen und Präferenzen.
            </p>
            <p>
                Die Corona-Pandemie hat außerdem dazu geführt, dass typische physische Treffpunkte durch virtuelle Alternativen ersetzt werden müssen. WhatsApp-Gruppen, Doodle-Listen oder E-Mail-Verteiler können dieses Problem zwar teilweise lösen, aber es ist umständlich und das eigentliche Problem wird nicht gelöst: Einfach und intuitiv eine Zeit und einen Ort für ein Treffen mit Freunden zu finden.
            </p>
            <p>
                Mithilfe von <b>tohuwabohu</b> kann ein Online-Gruppentreffen nun leicht und ohne langes hin und her umgesetzt werden.
            </p>
            <div className="spaced">
                <ButtonPrimary onClick={() => {
                    FlowRouter.go('new-event')
                }}>Event erstellen</ButtonPrimary>
            </div>
        </Layout>
    )
}

export default Dashboard
