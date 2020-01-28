import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Dimmer, Loader, Segment, Message } from "semantic-ui-react";

export const NotesList = () => {
  const notes = useSelector(state => state.notes.notes);

  const List = () => {
    return notes.map(note => {
      return (
        <Link key={note.id} to={"/note/" + note.id}>
          <Message>{note.title}</Message>
        </Link>
      );
    });
  };

  if (notes && notes.length > 0) {
    return (
      <Segment>
        <List />
      </Segment>
    );
  } else {
    return (
      <Segment>
        <Dimmer active>
          <Loader />
        </Dimmer>
      </Segment>
    );
  }
};
