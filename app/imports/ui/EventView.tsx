import React, { useState, useEffect } from "react";
import { Meteor } from "meteor/meteor";
import { withTracker } from "meteor/react-meteor-data";
import { FlowRouter } from "meteor/kadira:flow-router";
import {
  Text,
  Box,
  Stack,
  Input,
  Select,
  Heading,
  Button,
} from "@chakra-ui/core";

import ls from "local-storage";

import { EventsCollection } from "/imports/api/events";
import { Layout } from "/imports/ui/Layout";
import { TimeslotPropose } from "/imports/ui/Timeslot";
import UserSelection from "/imports/ui/UserSelection";
import EventDetails from "/imports/ui/EventDetails";
import { defaultText } from "/imports/util";

const EventView = (props) => {
  const event = props.event;
  const [userEmail, setUserEmail] = useState<string | void>(ls("userEmail"));
  const eventId = FlowRouter.getParam("eventId");

  useEffect(() => {
    Meteor.subscribe("event", eventId);
  }, []);

  return (
    <Layout>
      {event ? (
        <Stack>
          <Heading as="h1" size="lg">
            Einladung zu "{defaultText(event.title)}"
          </Heading>
          <Text>{event.authorName} hat dich zu einem Treffen eingeladen.</Text>

          {!event.final ? (
            <Stack>
              <Text>
                Wähle einen existierenden Teilnehmer oder füge einen neuen
                hinzu.
              </Text>
              <UserSelection
                eventId={event._id}
                participants={event.participants}
                selected={userEmail}
                changeCb={(res: string | undefined) => {
                  if (res) {
                    setUserEmail(res);
                  }
                }}
              />
            </Stack>
          ) : null}

          <EventDetails
            eventId={event._id}
            title={defaultText(event.title)}
            description={defaultText(event.description)}
            space={defaultText(event.space)}
            participants={event.participants}
            finalDate={event.finalDate}
            final={event.final}
          />

          {userEmail && !event.final ? (
            <>
              <Heading as="h2" size="lg">
                Wann kannst du?
              </Heading>
              <Text>
                Du kannst einen vorhandenen Vorschläg bestätigen oder einen
                neuen hinzufügen.
              </Text>
              <TimeslotPropose event={event} userEmail={userEmail} />
            </>
          ) : null}

          {userEmail === event.authorEmail && !event.final ? (
            <Button
              variantColor="purple"
              variant="solid"
              onClick={() => {
                FlowRouter.go("finalize-event", { eventId: eventId });
              }}
            >
              Zeitpunkt festmachen
            </Button>
          ) : null}
        </Stack>
      ) : null}
    </Layout>
  );
};

export default withTracker(() => {
  const eventId = FlowRouter.getParam("eventId");
  const handle = Meteor.subscribe("event", eventId);
  const event = EventsCollection.findOne({ _id: eventId });
  if (event) {
    const eventsVisited = ls("eventsVisited") ? ls("eventsVisited") : [];
    const alreadySeen = eventsVisited.find((event) => event._id == eventId);
    if (!alreadySeen) {
      // TODO: Fix setting seen events
      eventsVisited.unshift(event);
      ls("eventsVisited", eventsVisited);
    }
  }
  return {
    loading: !handle.ready(),
    event: event,
  };
})(EventView);
