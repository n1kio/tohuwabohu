import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { FlowRouter } from "meteor/kadira:flow-router";
import Swal from "sweetalert2";
import ls from "local-storage";

import { Layout } from "/imports/ui/Layout";
import {
  Button,
  ButtonPrimary,
  ButtonDisabled,
  FullInput,
} from "/imports/ui/Primitives";
import { Event } from "/imports/api/events";

const NewEventView = () => {
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [space, setSpace] = useState("");

  const formComplete = () => {
    console.log(authorName);
    const mandatory = [authorName, authorEmail, title, space];
    return mandatory.reduce((acc, field) => acc && field);
  };

  return (
    <Layout>
      <h1>Neues Event erstellen</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <h3>Dein Name und deine E-Mail Adresse</h3>
        <FullInput
          placeholder="Name"
          onChange={(e: any) => {
            setAuthorName(e.target.value);
          }}
          type="text"
          name="name"
        />
        <FullInput
          placeholder="E-Mail Adresse"
          onChange={(e: any) => {
            setAuthorEmail(e.target.value);
          }}
          type="email"
          name="email"
        />

        <h3>Titel des Events</h3>
        <FullInput
          onChange={(e: any) => {
            setTitle(e.target.value);
          }}
          placeholder="Titel"
          type="text"
          name="title"
        />

        <h3>Beschreibung des Events (optional)</h3>
        <FullInput
          onChange={(e: any) => {
            setDescription(e.target.value);
          }}
          placeholder="Beschreibung"
          type="text"
          name="description"
        />

        <h3>Treffpunkt</h3>
        <p>(z.B. Online, im Park, ...)</p>
        <FullInput
          onChange={(e: any) => {
            setSpace(e.target.value);
          }}
          placeholder="Treffpunkt"
          type="text"
          name="space"
        />

        <div className="actions spread-horizontal">
          <Button
            onClick={() => {
              FlowRouter.go("root");
            }}
          >
            zurück
          </Button>
          {formComplete() ? (
            <ButtonPrimary
              onClick={() => {
                // store session user as author
                ls("userEmail", authorEmail);

                // create event
                let event: Event = {
                  authorEmail,
                  authorName,
                  title,
                  description,
                  space,
                  participants: [
                    {
                      name: authorName,
                      email: authorEmail,
                    },
                  ],
                };

                Swal.fire({
                  title:
                    "Bist du mit der Verarbeitung deiner Daten einverstanden?",
                  text: "Zur Erstellung und Terminfindung speichern wir die von dir eingegebenen Daten. Darunter auch personenbezogene Daten wie deine E-Mail Adresse und deinen Namen.",
                  showCancelButton: true,
                  cancelButtonText: "Abbrechen",
                  confirmButtonText: "Ja, ich bin einverstanden",
                }).then((res) => {
                  if (res.value) {
                    Meteor.call("events.create", event, (err, res) => {
                      if (err) {
                        Swal.fire({
                          title: err,
                          icon: "error",
                        });
                      } else {
                        FlowRouter.go("view-event", { eventId: res });
                        Swal.fire({
                          icon: "success",
                          title: "Event erfolgreich angelegt!",
                          timer: 1000,
                          showConfirmButton: false,
                        });
                      }
                    });
                  }
                });
              }}
            >
              Event erstellen
            </ButtonPrimary>
          ) : (
            <ButtonDisabled
              onClick={() => {
                Swal.fire({
                  title: "Bitte Pflichtfelder ausfüllen.",
                  icon: "info",
                });
              }}
            >
              Event erstellen
            </ButtonDisabled>
          )}
        </div>
      </form>
    </Layout>
  );
};

export default NewEventView;
