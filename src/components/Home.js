import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../actions";
import {
  Button,
  Grid,
  Header,
  Message
  //Segment
} from "semantic-ui-react";

const Home = () => {
  const isLoggingOut = useSelector(state => state.auth.isLoggingOut);
  const logoutError = useSelector(state => state.auth.logoutError);
  const user = useSelector(state => state.auth.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column>
        <Header>Take Notes</Header>
        <Message>Email: {user.email}</Message>
        <Button onClick={handleLogout}>Logout</Button>
        {isLoggingOut && <Message>Logging Out....</Message>}
        {logoutError && <Message>Error logging out</Message>}
      </Grid.Column>
    </Grid>
  );
};

export default Home;
