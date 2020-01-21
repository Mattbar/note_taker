import React, { useCallback, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { updateNote, deletNote, uploadFile } from "../actions";
import {
  Grid,
  Header,
  Form,
  TextArea,
  Button,
  Dimmer,
  Loader,
  Segment,
  ImageGroup,
  Image,
  Input,
  Message
} from "semantic-ui-react";

const Notes = props => {
  const { params } = props.match;
  const user = useSelector(state => state.auth.user);
  const deleted = useSelector(state => state.auth.deleted);
  const notes = useSelector(state => state.auth.notes);
  const loadingData = useSelector(state => state.auth.isGettingData);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const curNote = useRef();

  const getNote = useCallback(() => {
    if (notes) {
      curNote.current = notes.find(n => n.ID === params.id);
      if (curNote.current) {
        setTitle(curNote.current.TITLE);
        setBody(curNote.current.BODY);
        setFiles(curNote.current.FILES);
      }
    }
  }, [notes, params.id]);

  const FilesList = () => {
    if (files && files.length !== 0) {
      return files.map(url => {
        return <Image size="small" src={url} alt="" key={url} />;
      });
    } else if (files && files.length === 0) {
      return (
        <Segment>
          <Message>No Additional Files</Message>
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

  useEffect(() => {
    getNote();
  }, [getNote, loadingData]);

  const handleSave = () => {
    const note = {
      TITLE: title,
      BODY: body,
      ID: params.id,
      FILES: files
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

  const handleFileChange = e => {
    if (e.target.files[0]) {
      const upload = e.target.files[0];
      setFile(upload);
    }
  };

  const handleUploadFile = e => {
    if (file === null) {
      return;
    }
    const note = {
      TITLE: title,
      BODY: body,
      ID: params.id,
      FILES: files
    };

    const data = {
      note,
      uid: user.uid,
      oldNotes: notes,
      nid: params.id,
      file
    };

    dispatch(uploadFile(data));
    e.target.value = null;
  };
  if (deleted) {
    return <Redirect to="/" />;
  }
  return (
    <Grid
      textAlign="center"
      style={{ height: "100vh" }}
      verticalAlign="middle"
      divided="vertically"
    >
      <Grid.Column>
        <Header>{title}</Header>
        <Grid.Row>
          <Form>
            <TextArea value={body} onChange={e => setBody(e.target.value)} />
          </Form>
        </Grid.Row>

        <Grid.Row columns={3}>
          <Link to={"/"}>
            <Button color="green" onClick={handleSave}>
              Save and go home
            </Button>
            <Button>Cancle</Button>
          </Link>
          <Button onClick={handleDelete}>Delete</Button>
        </Grid.Row>

        <Grid.Row>
          <Segment>
            <Input
              type="file"
              action={{
                icon: "upload",
                onClick: handleUploadFile
              }}
              onChange={handleFileChange}
            />
          </Segment>
        </Grid.Row>
        <ImageGroup>
          <FilesList />
        </ImageGroup>
      </Grid.Column>
    </Grid>
  );
};

export default Notes;
