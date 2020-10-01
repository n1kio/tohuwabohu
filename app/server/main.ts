import { Meteor } from "meteor/meteor";
import { EventsCollection } from "/imports/api/events";
import "/imports/methods";

Meteor.startup(() => {});

Meteor.publish("event", (eventId) => {
  return EventsCollection.find({ _id: eventId });
});
