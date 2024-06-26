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

const CustomNav = ({ children, icon, to, exact }) => {
  return (
    <NavLink
      to={"/everyone" + to}
      className={({ isActive }) => (isActive ? "active" : "")}
      end={exact}
    >
      <Button endIcon={icon} variant="outlined" color="secondary">
        {children}
      </Button>
    </NavLink>
  );
};

const Everyone = () => {
  const { tabName } = useParams();

  const renderContent = () => {
    switch (tabName?.toLowerCase()) {
      case "friends":
        return <Friends />;
      case "received":
        return <Received />;
      case "sent":
        return <Sent />;
      default:
        return <All />;
    }
  };

  return (
    <>
      <Paper>
        <Box
          display={"flex"}
          alignItems={"center"}

          height={40}
          gap={2}
          sx={{
            "& > .active": {
              backgroundColor: (theme) => `${theme.palette.primary.main}20`,
            },
          }}
        >
          <CustomNav to={""} icon={<PersonSearchTwoToneIcon />} exact>
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
      {renderContent()}
    </>
  );
};

const EveryoneMemo = React.memo(Everyone);

export default EveryoneMemo;
