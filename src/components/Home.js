import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser, getUserNotes } from "../actions";
import { Button, Grid, Header, Message } from "semantic-ui-react";

import { NotesList } from "./NotesList";

const Home = () => {
  const isLoggingOut = useSelector(state => state.auth.isLoggingOut);
  const logoutError = useSelector(state => state.auth.logoutError);
  const user = useSelector(state => state.auth.user);

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    if (user) {
      //console.log(user);
      dispatch(getUserNotes(user));
    }
  }, [dispatch, user]);

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
