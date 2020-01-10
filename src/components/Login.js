import React, { useState } from "react";
import firebase from "firebase/app";
//import { myFirebase } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { loginUser } from "../actions";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginError = useSelector(state => state.auth.loginError);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(loginUser(email, password));
  };

  const handleGoogle = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    provider.addScope("https://www.googleapis.com/auth/plus.login");

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(function(authData) {
        console.log(authData);
      })
      .catch(function(error) {
        console.log(error);
      });

    //dispatch(loginGoogle(provider));
  };

  if (isAuthenticated) {
    return <Redirect to="/" />;
  } else {
    return (
      <Grid
        textAlign="center"
        style={{ height: "100vh" }}
        verticalAlign="middle"
      >
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="blue" textAlign="center">
            Log-in
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Input
                fluid
                icon="user"
                iconPosition="left"
                placeholder="E-mail address"
                onChange={e => setEmail(e.target.value)}
              />
              <Form.Input
                fluid
                icon="lock"
                iconPosition="left"
                placeholder="Password"
                type="password"
                onChange={e => setPassword(e.target.value)}
              />
              {loginError && (
                <Message>
                  <Message.Header>Log In Error</Message.Header>
                  <p>Incorrect Email or Password</p>
                </Message>
              )}
              <Button color="blue" fluid size="large" onClick={handleSubmit}>
                Login
              </Button>
              <Button color="red" fluid size="large" onClick={handleGoogle}>
                Sign in with google
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
};

export default Login;
