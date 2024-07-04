/* eslint-disable react/display-name */
import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Avatar, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import NotifyIcon from "@mui/icons-material/NotificationsNone";
import { useNavigate } from "react-router-dom";
import Notification from "~/components/Notification";

function NotifyMenu() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{ width: 39, height: 39, backgroundColor: "primary.main" }}
            // variant="rounded"
          >
            <NotifyIcon fontSize="small" />
          </Avatar>
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setAnchorEl(null);
        }}
        // onClick={() => {
        //   setAnchorEl(null);
        // }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 40,
              height: 40,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 20,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
            // width: 350,
            minWidth: 400,
            maxWidth: 500,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography px={2} mb={1} fontWeight={500} fontSize={20}>
          Notification
        </Typography>

        <Notification />
        <Divider />

        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            navigate("/notification");
          }}
          sx={{ justifyContent: "center" }}
        >
          See more
        </MenuItem>
      </Menu>
    </>
  );
}

export default NotifyMenu;
