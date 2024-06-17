import React from "react";
import Paper from "~/components/Paper";

const Received = () => {
  return <Paper>Received</Paper>;
};

const ReceivedMemo = React.memo(Received);

export default ReceivedMemo;
