import React from "react";
import Paper from "~/components/Paper";

function Message() {
  return (
    <>
      <Paper>Message</Paper>
    </>
  );
}

const MessageMemo = React.memo(Message);

export default MessageMemo;
