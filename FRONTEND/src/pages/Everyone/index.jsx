import React from "react";
import Paper from "~/components/Paper";

const Everyone = () => {
  return (
    <>
      <Paper>Everyone</Paper>
    </>
  );
};

const EveryoneMemo = React.memo(Everyone);

export default EveryoneMemo;
