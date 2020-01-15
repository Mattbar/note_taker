import React, { useCallback, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { updateNote, deletNote } from "../actions";
import { Grid, Header, Form, TextArea, Button } from "semantic-ui-react";

const Notes = props => {
  const { params } = props.match;
  const user = useSelector(state => state.auth.user);
  const deleted = useSelector(state => state.auth.deleted);
  const dispatch = useDispatch();
  const notes = useSelector(state => state.auth.notes);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const curNote = useRef();

  const getNote = useCallback(() => {
    curNote.current = notes.find(n => n.ID === params.id);
    if (curNote.current) {
      setTitle(curNote.current.TITLE);
      setBody(curNote.current.BODY);
    }
  }, [notes, params.id]);

  useEffect(() => {
    getNote();
  }, [getNote]);

  const handleSave = () => {
    const note = {
      TITLE: title,
      BODY: body,
      ID: params.id
    };
    const uid = user.uid;
    const oldNotes = notes;

    const data = {
      note,
      uid,
      oldNotes
    };
    dispatch(updateNote(data));
  };

  const handleDelete = () => {
    const data = {
      uid: user.uid,
      nid: params.id,
      oldNotes: notes
    };
    dispatch(deletNote(data));
  };
  if (deleted) {
    return <Redirect to="/" />;
  }
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column>
        <Header>{title}</Header>
        <Form>
          <TextArea value={body} onChange={e => setBody(e.target.value)} />
        </Form>

        <Link to={"/"}>
          <Button color="green" onClick={handleSave}>
            Save and go home
          </Button>
        </Link>
        <Button onClick={handleDelete}>Delete</Button>
      </Grid.Column>
    </Grid>
  );
};

export default Notes;
