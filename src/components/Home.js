import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../actions";
import {
  Button,
  Grid,
  Header,
  Message,
  Dimmer,
  Loader,
  Segment
} from "semantic-ui-react";

const Home = () => {
  const isLoggingOut = useSelector(state => state.auth.isLoggingOut);
  const logoutError = useSelector(state => state.auth.logoutError);
  const user = useSelector(state => state.auth.user);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const NotesList = () => {
    const notes = useSelector(state => state.auth.notes);
    console.log("NOTES" + JSON.stringify(notes));
    if (notes) {
      return notes.map(note => {
        return (
          <Link key={note.ID} to={"/note/" + note.ID}>
            <Message>{note.TITLE + ", " + note.ID}</Message>
          </Link>
        );
      });
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

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column>
        <Header>Take Notes</Header>
        <Message>Email: {user.email}</Message>
        <NotesList />
        <Link to={"/newNote/"}>
          <Button>Add Note</Button>
        </Link>
        <Button onClick={handleLogout}>Logout</Button>
        {isLoggingOut && <Message>Logging Out....</Message>}
        {logoutError && <Message>Error logging out</Message>}
      </Grid.Column>
    </Grid>
  );
};

export default Home;
