import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { loginUserEmail, loginUserGoogle, signUpEmail } from "../actions";
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
    dispatch(loginUserEmail(email, password));
  };

  const handleGoogle = () => {
    dispatch(loginUserGoogle());
  };

  const handleSignUp = () => {
    dispatch(signUpEmail(email, password));
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
              <Button
                color="google plus"
                fluid
                size="large"
                onClick={handleGoogle}
              >
                Sign in with google
              </Button>
              <Button color="green" fluid size="large" onClick={handleSignUp}>
                Sign Up
              </Button>
            </Segment>
          </Form>
        </Grid.Column>
      </Grid>
    );
  }
};

export default Login;
