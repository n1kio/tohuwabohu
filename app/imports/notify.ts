import sgMail from "@sendgrid/mail";

const sendMail = (msg: {
  to?: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  bcc?: [string];
}) => {
  if (Meteor.isServer) {
    if (Meteor.settings.private && Meteor.settings.private.SENDGRID_API_KEY) {
      const apiKey = Meteor.settings.private.SENDGRID_API_KEY;
      sgMail.setApiKey(apiKey);

      if ((!msg.to && !msg.bcc) || !msg.from || !msg.subject || !msg.text) {
        console.error(
          "Missing value for sending email. Skipping sendMail.",
          msg
        );
        return false;
      }
      sgMail.send(msg);
      return true;
    } else {
      console.warn(
        "Provide an `SENDGRID_API_KEY` in settings.json to send emails."
      );
    }
  }
};

export { sendMail };
