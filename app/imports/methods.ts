import { Meteor } from "meteor/meteor";

import { EventsCollection, Event, Participant } from "/imports/api/events";
import {
  hasParticipantTimeslot,
  roundTime,
  eventUrl,
  isEmailValid,
  formatDateTime,
} from "/imports/util";
import { google } from "calendar-link";
import moment from "moment-timezone";

import { sendMail } from "/imports/notify";

const maximumParticipants = 15;

Meteor.methods({
  "events.create": (event: Event) => {
    if (!event) {
      throw new Meteor.Error(500, "No event given.");
    }
    const eventId = EventsCollection.insert(event);
    const fromMail =
      Meteor.settings.public.from_email ?? "robo@niklasappelmann.de";
    sendMail({
      to: event.authorEmail,
      from: fromMail,
      subject: "Glückwunsch, dein Event wurde angelegt!",
      text: `Das Event mit dem Titel ${
        event.title
      } wurde erfolgreich angelegt. Bearbeite es oder lade Freunde ein unter ${eventUrl(
        eventId
      )}`,
      html: `<h1>${event.title}</h1><p>Das Event mit dem Titel <strong>${
        event.title
      }</strong> wurde erfolgreich angelegt.</p><p>Bearbeite es oder lade Freunde ein unter <a href="${eventUrl(
        eventId
      )}">${eventUrl(eventId)}</a></p>`,
    });
    return eventId;
  },

  "events.get": (eventId: string) => {
    return EventsCollection.findOne({ _id: eventId });
  },

  "events.toggleTimeslot": ({
    eventId,
    userEmail,
    timeslot,
  }: {
    eventId: string;
    userEmail: string;
    timeslot: Date;
  }) => {
    // server only to prevent client prediction
    if (Meteor.isServer) {
      const event = EventsCollection.findOne({ _id: eventId });
      if (!event) {
        throw new Meteor.Error(500, "Event not found.");
      }

      const participantResult = event.participants?.filter(
        (participant) => participant.email == userEmail
      );
      const participant =
        participantResult?.length === 1 ? participantResult[0] : null;
      if (!participant) {
        throw new Meteor.Error(500, "Participant not found.");
      }

      // add or pull timeslot from participant based on current inclusion
      const operation = hasParticipantTimeslot(
        event.participants,
        userEmail,
        timeslot
      )
        ? "$pull"
        : "$addToSet";
      EventsCollection.update(
        {
          _id: eventId,
          "participants.email": participant.email,
        },
        {
          [`${operation}`]: { "participants.$.timeslots": roundTime(timeslot) },
        }
      );

      return true;
    }
  },

  "events.addParticipant": ({
    eventId,
    participant,
  }: {
    eventId: string;
    participant: Participant;
  }) => {
    if (!participant) {
      throw new Meteor.Error(500, "No participant given.");
    }
    const event = EventsCollection.findOne({ _id: eventId });
    if (!event) {
      throw new Meteor.Error(500, "Event not found.");
    }

    // limit to keep events manageable, might increase later
    const participantCount = event.participants?.length;
    if (participantCount && participantCount >= maximumParticipants) {
      throw new Meteor.Error(
        500,
        "Only `${maximumParticipants}` participants allowed per event."
      );
    }

    const alreadyExists = EventsCollection.findOne({
      _id: eventId,
      "participants.email": participant.email?.toLowerCase(),
    });
    if (alreadyExists) {
      throw new Meteor.Error(500, "Teilnehmer existiert bereits im Event.");
    }

    EventsCollection.update(
      { _id: eventId },
      { $addToSet: { participants: participant } }
    );
    return true;
  },

  "events.finalize": ({
    eventId,
    finalDate,
  }: {
    eventId: string;
    finalDate: Date;
  }) => {
    const event = EventsCollection.findOne({ _id: eventId });
    if (!event || !event._id) {
      throw new Meteor.Error(500, "Event not found.");
    }

    EventsCollection.update(
      { _id: eventId },
      {
        $set: {
          final: true,
          finalDate,
        },
      }
    );

    moment.locale("de");
    const eventDate = moment(finalDate).tz("Europe/Berlin");
    const calendarEvent = {
      title: event.title,
      description: event.description,
      start: eventDate,
      location: event.space,
      duration: [1, "hour"],
      url: eventUrl(event._id),
    };
    const googleLink = google(calendarEvent);

    const fromMail = Meteor.settings.public.from_email;
    event.participants?.forEach((participant) => {
      if (isEmailValid(participant.email)) {
        sendMail({
          to: participant.email,
          from: fromMail ? fromMail : event.authorEmail,
          subject: `${event.authorName} hat das Event "${event.title}" finalisiert! 🎉`,
          text: `${
            event.title
          } findet zur folgenden Zeit statt: ${formatDateTime(
            finalDate
          )}. Treffpunkt ist: ${event.space}. Link zum Event: ${eventUrl(
            eventId
          )} Link um zu Google Kalendar hinzuzufügen: ${googleLink}`,
          html: `${
            event.title
          } findet zur folgenden Zeit statt: ${formatDateTime(
            finalDate
          )}. <br>Treffpunkt ist: ${
            event.space
          }. <br><br>Link zum Event: ${eventUrl(
            eventId
          )}<br><br><a href="${googleLink}">Zu Google Kalendar hinzufügen</a>`,
        });
      } else {
        console.warn("Invalid email", participant.email);
      }
    });
    return true;
  },
});
