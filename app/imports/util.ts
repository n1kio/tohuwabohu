import { Participant } from "/imports/api/events";
import moment from "moment-timezone";

const hasParticipantTimeslot = (
  participants: [Participant],
  userEmail: string,
  timeslot: Date
): boolean => {
  /**
   * Returns the result of the existance check of a timeslot within a participant's timeslots.
   *
   * @param participants - List of all event participants
   * @param userEmail - The email address of the session user
   * @param timeslot - The date to check for
   * @returns A boolean containing the result of the existance check
   */

  const participant: Participant = participants?.filter((participant) => {
    return participant.email === userEmail;
  })[0];
  if (participant) {
    const result = participant.timeslots?.filter((pTimeslot) => {
      return "" + roundTime(pTimeslot) === "" + roundTime(timeslot);
    });
    return result?.length === 1;
  }
  return false;
};

const roundTime = (datetime: Date): Date => {
  /**
   * Round time to the nearest minute.
   *
   * @param datetime - The datetime to round
   * @returns A rounded datetime
   */
  datetime.setSeconds(
    datetime.getMinutes() + Math.round(datetime.getSeconds() / 60)
  );
  datetime.setSeconds(0, 0);
  return datetime;
};

const eventUrl = (eventId: string): string => {
  const rootUrl = Meteor.absoluteUrl();
  return `${rootUrl}e/${eventId}`;
};

const uniqueTimeslots = (event: Event) => {
  let timestrings = new Set();
  const participants = event.participants || [];
  participants.forEach((participant) => {
    participant.timeslots?.forEach((timeslot) => {
      timestrings.add("" + timeslot);
    });
  });
  const uniqueSlots = Array.from(timestrings).map(
    (timestring) => new Date(timestring)
  );
  return uniqueSlots;
};

const isEmailValid = (email: string): boolean => {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const formatDateTime = (date: Date): string => {
  moment.locale("de");
  let now = moment(date).tz("Europe/Berlin").format("dddd DD.MM.YYYY, HH:mm");
  return now + " Uhr";
};

const filterParticipants = (participants: [Participant], timeslot: date) => {
  return participants.filter((participant) => {
    let match = false;
    participant.timeslots?.forEach((pTimeslot) => {
      if ("" + pTimeslot === "" + timeslot) {
        match = true;
      }
    });
    return match;
  });
};

const defaultText = (text: string | undefined) => {
  if (text === "") {
    return "keine Angabe";
  }
  return text;
};

export {
  hasParticipantTimeslot,
  roundTime,
  eventUrl,
  uniqueTimeslots,
  isEmailValid,
  formatDateTime,
  filterParticipants,
  defaultText,
};
