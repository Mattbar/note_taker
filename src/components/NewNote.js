import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { saveNote } from "../actions";
import {
  Grid,
  Header,
  Form,
  TextArea,
  Button
  //Segment
} from "semantic-ui-react";

const Notes = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const notes = useSelector(state => state.auth.notes);

  const handleSave = () => {
    const uid = user.uid;
    const note = {
      title: title,
      body: body
    };

    dispatch(saveNote(uid, note, notes));
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column>
        <Header>Create New Note</Header>
        <Form>
          <TextArea
            placeholder={"Note Title"}
            onChange={e => setTitle(e.target.value)}
          ></TextArea>
          <TextArea
            placeholder={"Note Body"}
            onChange={e => setBody(e.target.value)}
          />
          <Button color="green" size="medium" onClick={handleSave}>
            Save Note
          </Button>
          <Link to={"/"}>
            <Button>Notes Home</Button>
          </Link>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Notes;
