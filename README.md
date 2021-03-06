![Tohuwabohu Header](/app/public/header.jpg)
# Tohuwabohu
Der Organisator für Online Gruppentreffen.

## Installation
- Projekt klonen
- in `app`-Verzeichnis wechseln: `cd app`
- Docker Container bauen und mit Tag "tohuwabohu" versehen: `docker build -t tohuwabohu .`
- Docker Container ausführen: `docker run -it -p 3000:3000 -p 3001:3001 tohuwabohu`
- Die App kann nun im Browser unter http://localhost:3000 aufgerufen werden

## Screenshot
![Tohuwabohu App](/app/public/screen.jpg)

## Verwendete Technologien
- TypeScript (Fullstack)
- React + StyledComponents
- Node.js
- Meteor.js
- Docker
- SendGrid
- Außerdem viel Kaffee

## Hintergrund
Ein Treffen mit vielen Personen zu organisieren kann anstrengend sein. 

Häufig ist es nicht nur eine Herausforderung einen passenden Tag für ein Treffen zu finden, sondern auch einen geeigneten Treffpunkt auszumachen. Viele Personen bedeutet oft viele unterschiedliche Terminkalender, Lebenssituationen und Präferenzen. 

Die Corona-Pandemie hat außerdem dazu geführt, dass typische physische Treffpunkte durch virtuelle Alternativen ersetzt werden müssen. WhatsApp-Gruppen, Doodle-Listen oder E-Mail-Verteiler können dieses Problem zwar lösen, aber es ist umständlich und sind keine speziellen Lösungen für das eigentliche Problem: Einfach und intuitiv eine Zeit und einen Ort für ein Treffen mit Freunden zu finden.

## Lösung
Mithilfe von Tohuwabohu kann ein Gruppentreffen nun leicht und verständlich umgesetzt werden.

### Ablauf
1.	Eine Person im Freundeskreis übernimmt die Rolle des Organisators und erstellt ein Event, zudem er seine Freunde per E-Mail oder mithilfe eines Links einladen kann. Der Organisator schlägt maximal 4 Termine mit Datum und Uhrzeit vor. Außerdem gibt er den Ort des Treffens bekannt. Er hat die Möglichkeit das Event zu beschreiben und/oder eine kurze Nachricht an seine Freunde zu erfassen. Sobald er das Event erstellt hat bekommt er eine E-Mail mit einem Link zum Event. Mithilfe des Links kann er das Event nochmal bearbeiten oder den Link mit seinen Freunden teilen.

2.	Der Organisator teilt den Links des Events mit seinen Freunden. Jeder seiner Freunde kann nun 
unter seinem Namen angeben, ob er an den vorgeschlagenen Tagen und Uhrzeiten Zeit hat. Falls kein passender Termin dabei ist, ist es möglich einen Gegenvorschlag zu machen. Den neuen Vorschlag können alle Teilnehmer des Events einsehen und angeben, ob sie an diesem Termin auch können. Der Organisator und seine Freunde sehen, wer an welchem Tag Zeit hat.

3.	Ausschließlich der Organisator hat die Möglichkeit zu entscheiden, wann ein passender Termin für ein Event gefunden wurde. Als Entscheidungsgrundlage werden ihm alle ausgewählten Termine mit der Teilnehmerzahl angezeigt. Er kann dann einen Termin auswählen und speichern. Sobald er einen Termin gespeichert hat, bekommen er und seine Freunde eine Bestätigungs-E-Mail mit allen relevanten Details. 
