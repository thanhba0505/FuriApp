/* eslint-disable react-refresh/only-export-components */
import { Box, Typography } from "@mui/material";
import { memo } from "react";
import Notification from "~/components/Notification";
import PaperCustom from "~/components/Paper";

const Notifications = () => {
  return (
    <PaperCustom h={"calc(100% - 24px)"} mh={800}>
      <Typography fontSize={18} fontWeight={700} lineHeight={1} mb={2}>
        Notification
      </Typography>

      <Box
        sx={{
          overflowY: "auto",
          "::-webkit-scrollbar": {
            width: "4px",
            height: "8px",
            backgroundColor: "action.hover",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "action.hover",
          },
          height: "calc(100% - 34px)",
        }}
      >
        <Notification />
      </Box>
    </PaperCustom>
  );
};

export default memo(Notifications);
