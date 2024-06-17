import React from "react";
import { useParams } from "react-router-dom";
import Paper from "~/components/Paper";

function Message() {
  const { conversationId } = useParams();

  return (
    <>
      <Paper>Message: {conversationId}</Paper>
    </>
  );
}

const MessageMemo = React.memo(Message);

export default MessageMemo;
