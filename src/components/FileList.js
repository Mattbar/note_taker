import React from "react";

import { Image, Segment, Message, Dimmer, Loader } from "semantic-ui-react";

const FileList = noteFiles => {
  const files = noteFiles.noteFiles;
  if (files && files.length > 0) {
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

export default FileList;
