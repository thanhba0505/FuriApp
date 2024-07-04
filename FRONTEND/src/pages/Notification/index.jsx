/* eslint-disable react-refresh/only-export-components */
import { Typography } from "@mui/material";
import { memo } from "react";
import Notification from "~/components/Notification";
import PaperCustom from "~/components/Paper";

const Notifications = () => {
  return (
    <PaperCustom>
      <Typography fontSize={18} fontWeight={700} lineHeight={1} mb={2}>
        Notification
      </Typography>

      <Notification />
    </PaperCustom>
  );
};

export default memo(Notifications);
