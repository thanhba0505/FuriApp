import { Box, Button } from "@mui/material";
import React from "react";
import Paper from "~/components/Paper";
import PersonSearchTwoToneIcon from "@mui/icons-material/PersonSearchTwoTone";
import Diversity3TwoToneIcon from "@mui/icons-material/Diversity3TwoTone";
import PersonAddTwoToneIcon from "@mui/icons-material/PersonAddTwoTone";
import ScheduleSendTwoToneIcon from "@mui/icons-material/ScheduleSendTwoTone";
import { NavLink, useParams } from "react-router-dom";
import All from "./All";
import Friends from "./Friends";
import Received from "./Received";
import Sent from "./Sent";

const CustomNav = ({ children, icon, to }) => {
  return (
    <NavLink to={"/everyone" + to}>
      <Button endIcon={icon} variant="outlined" color="secondary">
        {children}
      </Button>
    </NavLink>
  );
};

const Everyone = () => {
  const { tabId } = useParams();

  return (
    <>
      <Paper>
        <Box
          display={"flex"}
          gap={2}
          sx={{
            "& > .active": {
              backgroundColor: (theme) => `${theme.palette.primary.main}20`,
            },
          }}
        >
          <CustomNav to={"/all"} icon={<PersonSearchTwoToneIcon />}>
            All
          </CustomNav>
          <CustomNav to={"/friends"} icon={<Diversity3TwoToneIcon />}>
            Friends
          </CustomNav>
          <CustomNav to={"/received"} icon={<PersonAddTwoToneIcon />}>
            Received
          </CustomNav>
          <CustomNav to={"/sent"} icon={<ScheduleSendTwoToneIcon />}>
            Sent
          </CustomNav>
        </Box>
      </Paper>

      {!tabId || tabId == "all" ? (
        <All />
      ) : tabId == "friends" ? (
        <Friends />
      ) : tabId == "Received" ? (
        <Received />
      ) : (
        <Sent />
      )}
    </>
  );
};

const EveryoneMemo = React.memo(Everyone);

export default EveryoneMemo;
