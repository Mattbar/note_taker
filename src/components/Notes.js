import React, { useCallback, useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { updateNote, deletNote, uploadFile } from "../actions";
import * as mmb from "music-metadata-browser";
import {
  Grid,
  Header,
  Form,
  TextArea,
  Button,
  Segment,
  ImageGroup,
  Input,
  Progress
} from "semantic-ui-react";

import FilesList from "./FileList";

const Notes = props => {
  const { params } = props.match;
  const user = useSelector(state => state.auth.user);
  const deleted = useSelector(state => state.auth.deleted);
  const notes = useSelector(state => state.notes.notes);
  const loadingData = useSelector(state => state.files.isGettingData);
  const percent = useSelector(state => state.files.uploadPercent);
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState();
  const [files, setFiles] = useState();
  const curNote = useRef();
  const inputRef = useRef();

  const getNote = useCallback(() => {
    if (notes) {
      curNote.current = notes.find(n => n.id === params.id);
      if (curNote.current) {
        setTitle(curNote.current.title);
        setBody(curNote.current.body);
        setFiles(curNote.current.files);
      }
    }
  }, [notes, params.id]);

  useEffect(() => {
    if (!loadingData) {
      getNote();
    }
  }, [getNote, loadingData]);

  const handleSave = () => {
    const note = {
      title: title,
      body: body,
      id: params.id,
      files: files
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

  const handleFileChange = async e => {
    if (e.target.files[0]) {
      const upload = e.target.files[0];
      setFile(upload);
      try {
        const metadata = await parseFile(upload);
        // Update GUI
        console.log(metadata);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const parseFile = async upload => {
    console.log(`Parsing file "${upload.name}" of type ${upload.type}`);

    return mmb.parseBlob(upload, { native: true }).then(metadata => {
      console.log(`Completed parsing of ${upload.name}:`, metadata);
      return metadata;
    });
  };

  const handleUploadFile = e => {
    if (file === null || inputRef.current.inputRef.current.value === "") {
      return;
    }

    const note = {
      title: title,
      body: body,
      id: params.id,
      files: files
    };

    const data = {
      note,
      uid: user.uid,
      oldNotes: notes,
      nid: params.id,
      file
    };
    dispatch(uploadFile(data));
    inputRef.current.inputRef.current.value = "";
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
            {loadingData && <Progress percent={percent} indicating />}
            <Input
              type="file"
              accept="audio/*"
              disabled={loadingData}
              ref={inputRef}
              action={{
                icon: "upload",
                onClick: handleUploadFile
              }}
              onChange={handleFileChange}
            />
          </Segment>
        </Grid.Row>
        <ImageGroup>{files && <FilesList noteFiles={files} />}</ImageGroup>
      </Grid.Column>
    </Grid>
  );
};

export default Notes;
