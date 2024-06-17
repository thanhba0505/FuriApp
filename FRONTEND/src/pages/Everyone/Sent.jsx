import React from "react";
import Paper from "~/components/Paper";

const Sent = () => {
  return <Paper>Sent</Paper>;
};

const SentMemo = React.memo(Sent);

export default SentMemo;
