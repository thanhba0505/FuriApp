import React from "react";
import { useParams } from "react-router-dom";
import ListConversation from "./ListConversation";
import MessageChatBox from "./MessageChatBox";

function Message() {
  const { conversationId } = useParams();

  return <>{conversationId ? <MessageChatBox /> : <ListConversation />}</>;
}

const MessageMemo = React.memo(Message);

export default MessageMemo;
