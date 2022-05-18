import React from "react";
import { FlowRouter } from "meteor/kadira:flow-router";
import ls from "local-storage";
import {
  List,
  ListItem,
  Text,
  Button,
  Stack,
  Heading,
  Box,
} from "@chakra-ui/core";

import { Event } from "/imports/api/events";
import { Layout } from "/imports/ui/Layout";

const Dashboard = () => {
  const eventsVisited = ls("eventsVisited") ? ls("eventsVisited") : [];
  return (
    <Layout>
      <Stack spacing={8}>
        <Heading as="h1" size="xl">
          Einfach Treffen organisieren!
        </Heading>
        {eventsVisited.length > 0 ? (
          <Stack spacing={4}>
            <Text>
              Hier siehst du die letzten 10 Events, die du mit diesen Gerät
              besucht hast. Das neuste Event steht vorne.
            </Text>
            <Stack isInline spacing={4}>
              {eventsVisited
                .filter((x) => x.createdAt)
                .sort((a, b) => {
                  return a?.createdAt < b?.createdAt;
                })
                .slice(0, 10)
                .map((event: Event) => (
                  <Button
                    variantColor="green"
                    variant="outline"
                    key={event._id}
                    onClick={() => {
                      FlowRouter.go("view-event", { eventId: event._id });
                    }}
                  >
                    {event.title}
                  </Button>
                ))}
            </Stack>
          </Stack>
        ) : null}

        <Heading as="h2" size="lg">
          In 3 einfachen Schritten zum Termin für ein Treffen
        </Heading>
        <List as="ol" styleType="decimal">
          <ListItem>Event erstellen</ListItem>
          <ListItem>Link an Freunde schicken</ListItem>
          <ListItem>Einen passenden Zeitpunkt terminieren</ListItem>
        </List>

        <Box>
          <Button
            variant="solid"
            variantColor="purple"
            onClick={() => {
              FlowRouter.go("new-event");
            }}
          >
            Neues event erstellen
          </Button>
        </Box>
      </Stack>
    </Layout>
  );
};

export default Dashboard;
