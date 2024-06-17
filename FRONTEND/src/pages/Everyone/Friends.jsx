import React from "react";
import Paper from "~/components/Paper";

const Friends = () => {
  return <Paper>Friends</Paper>;
};

const FriendsMemo = React.memo(Friends);

export default FriendsMemo;
