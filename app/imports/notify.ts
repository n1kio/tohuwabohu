import sgMail from '@sendgrid/mail'

const sendMail = (msg:{to:string, from:string, subject:string, text:string, html?:string}) => {
    const apiKey = Meteor.settings.private.SENDGRID_API_KEY
    sgMail.setApiKey(apiKey)

    if (!msg.to || !msg.from || !msg.subject || !msg.text) {
        console.error('Missing value for sending email. Skipping sendMail.', msg)
        return false
    }
    if (apiKey) {
        sgMail.send(msg)
    } else {
        console.log('Provide an `SENDGRID_API_KEY` in settings.json to send emails.')
    }
    return true
}

export { sendMail }
