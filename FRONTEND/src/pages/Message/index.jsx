import React from "react";
import { useParams } from "react-router-dom";
import ListConversation from "./ListConversation";
import MainMessage from "./MainMessage";

function Message() {
  const { conversationId } = useParams();

  return <>{conversationId ? <MainMessage /> : <ListConversation />}</>;
}

const MessageMemo = React.memo(Message);

export default MessageMemo;
