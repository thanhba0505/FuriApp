/* eslint-disable react/display-name */
import * as React from "react";

import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import HomeIcon from "@mui/icons-material/HomeTwoTone";
import VideoIcon from "@mui/icons-material/VideoLibraryTwoTone";
import StoreIcon from "@mui/icons-material/StorefrontTwoTone";
import GroupsIcon from "@mui/icons-material/GroupsTwoTone";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";

import Sidebar from "../components/SidebarLeft";

import Paper from "~/components/Paper";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { getImageBlob } from "~/api/imageApi";

// PaperFirst
const PaperFirst = React.memo(() => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const avatar = account?.avatar;

  const [img, setImg] = useState();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, avatar);
        setImg(result);
      } catch (error) {
        console.log({ error });
      }
    };
    if (avatar && accessToken) {
      fetchImage();
    }
  }, [avatar, accessToken]);
  
  return (
    <Paper>
      <Grid container rowSpacing={1}>
        <Grid item xs={3}>
          <Avatar
            sx={{ width: "48px", height: "48px", borderRadius: 2 }}
            src={img ? img : ""}
          ></Avatar>
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
  const currentUrl = window.location.pathname;

  let i = 0;
  const tabs = [
    { label: "Home", path: "/", icon: <HomeIcon />, custom: false },
    { label: "Video", path: "/video", icon: <VideoIcon />, custom: false },
    { label: "Group", path: "/group", icon: <GroupsIcon />, custom: true },
    { label: "Store", path: "/store", icon: <StoreIcon />, custom: false },
  ];

  for (let index = tabs.length - 1; index >= 0; index--) {
    if (currentUrl.startsWith(tabs[index].path)) {
      i = index;
      break;
    }
  }

  const [selectedIndex, setSelectedIndex] = React.useState(i);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
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
        }}
        component="nav"
        aria-label="main mailbox folders"
      >
        {tabs.map((tab, index) => (
          <NavLink to={tab.path} key={index}>
            <ListItemButton
              selected={selectedIndex === index}
              onClick={(event) => handleListItemClick(event, index)}
            >
              <ListItemIcon>{tab.icon}</ListItemIcon>

              <ListItemText>
                <Typography variant="body1">{tab.label}</Typography>
              </ListItemText>
            </ListItemButton>
            <Divider />
          </NavLink>
        ))}
      </List>
    </Paper>
  );
});

// PaperThird
const PaperThird = React.memo(() => {
  return <Paper></Paper>;
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
