/* eslint-disable react/display-name */
import * as React from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/HomeTwoTone";
import VideoIcon from "@mui/icons-material/VideoLibraryTwoTone";
import GroupsIcon from "@mui/icons-material/GroupsTwoTone";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import ForumIcon from "@mui/icons-material/ForumTwoTone";
import NotifyIcon from "@mui/icons-material/CircleNotificationsTwoTone";

import Sidebar from "../components/SidebarLeft";

import Paper from "~/components/Paper";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";

// PaperFirst
const PaperFirst = React.memo(() => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const avatar = account?.avatar;

  const navigate = useNavigate();

  const handleLinkProfile = () => {
    navigate("/profile/" + account._id);
  };

  return (
    <Paper>
      <Grid
        container
        rowSpacing={1}
        onClick={handleLinkProfile}
        sx={{ cursor: "pointer" }}
      >
        <Grid item xs={3}>
          <Avatar
            sx={{
              width: "48px",
              height: "48px",
              borderRadius: 2,
              fontSize: 24,
            }}
            src={avatar ? avatar : ""}
          >
            {!avatar && getFirstLetterUpperCase(account?.fullname)}
          </Avatar>
        </Grid>

        <Grid item xs={9}>
          <Typography variant="body1" fontWeight={700}>
            {account?.fullname}
          </Typography>
          <Typography variant="body2">@{account?.username}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
});

// PaperSecond
const PaperSecond = React.memo(() => {
  const tabs = useMemo(
    () => [
      { label: "Home", path: "/", icon: <HomeIcon />, custom: false },
      { label: "Video", path: "/video", icon: <VideoIcon />, custom: false },
      {
        label: "Everyone",
        path: "/everyone",
        icon: <GroupsIcon />,
        custom: false,
      },
      { label: "Message", path: "/message", icon: <ForumIcon />, custom: true },
      {
        label: "Notification",
        path: "/notification",
        icon: <NotifyIcon />,
        custom: true,
      },
    ],
    []
  );

  const navigate = useNavigate();
  const location = useLocation();

  const handleLink = (to) => {
    navigate(to);
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Paper>
      <List
        sx={{
          ">a": {
            textDecoration: "none",
            borderRadius: 1,
            overflow: "hidden",
            color: "unset",
            display: "block",
          },
          ".MuiButtonBase-root": {
            height: "60px",
          },
          ".MuiListItemIcon-root": {
            paddingRight: "18px",
            justifyContent: "center",
            minWidth: "60px",
          },
          "& .active": {
            backgroundColor: (theme) => `${theme.palette.primary.main}10`,
          },
        }}
        component="nav"
        aria-label="main mailbox folders"
      >
        {tabs.map((tab, index) => (
          <React.Fragment key={index}>
            <ListItemButton
              onClick={() => handleLink(tab.path)}
              className={isActive(tab.path) ? "active" : ""}
            >
              <ListItemIcon>{tab.icon}</ListItemIcon>
              <ListItemText>
                <Typography variant="body1">{tab.label}</Typography>
              </ListItemText>
            </ListItemButton>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
});

// PaperThird
const PaperThird = React.memo(() => {
  return <Paper>Coming soon</Paper>;
});

const SidebarLeft = ({ xs = {} }) => {
  return (
    <Sidebar xs={xs}>
      <PaperFirst />
      <PaperSecond />
      <PaperThird />
    </Sidebar>
  );
};

const SidebarLeftMemo = React.memo(SidebarLeft);

export default SidebarLeftMemo;
