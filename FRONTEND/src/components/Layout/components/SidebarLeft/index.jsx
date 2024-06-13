import Grid from "@mui/material/Grid";
import React from "react";

function SidebarLeft({ children, xs = {} }) {
  return (
    <Grid item xs={xs}>
      {children}
    </Grid>
  );
}

const SidebarLeftMemo = React.memo(SidebarLeft);

export default SidebarLeftMemo;
