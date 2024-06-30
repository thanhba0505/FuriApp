import { Box, Button } from "@mui/material";
import React from "react";
import Paper from "~/components/Paper";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import All from "./All";
import Friends from "./Friends";
import Received from "./Received";
import Sent from "./Sent";

const Everyone = () => {
  const { tabName } = useParams();
  const navigate = useNavigate();

  const tabNameCurrent = tabName ? tabName : "";

  const renderContent = () => {
    switch (tabNameCurrent?.toLowerCase()) {
      case "friends":
        return <Friends />;
      case "received":
        return <Received />;
      case "sent":
        return <Sent />;
      case "":
        return <All />;
      default:
        return <Navigate to={"/everyone"} />;
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
          <Button
            variant={!tabNameCurrent ? "contained" : "outlined"}
            onClick={() => navigate("/everyone")}
          >
            All
          </Button>
          <Button
            variant={tabNameCurrent == "friends" ? "contained" : "outlined"}
            onClick={() => navigate("/everyone/friends")}
          >
            Friends
          </Button>
          <Button
            variant={tabNameCurrent == "received" ? "contained" : "outlined"}
            onClick={() => navigate("/everyone/received")}
          >
            Received
          </Button>
          <Button
            variant={tabNameCurrent == "sent" ? "contained" : "outlined"}
            onClick={() => navigate("/everyone/sent")}
          >
            Sent
          </Button>
        </Box>
      </Paper>
      {renderContent()}
    </>
  );
};

const EveryoneMemo = React.memo(Everyone);

export default EveryoneMemo;
