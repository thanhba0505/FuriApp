import { Grid } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import Paper from "~/components/Paper";


const Profile = () => {
  const { accountId } = useParams();

  return <Paper>
    <Grid container >
      <Grid item >Profile: {accountId}</Grid>
    </Grid>
  </Paper>;
};

const ProfileMemo = React.memo(Profile);

export default ProfileMemo;
