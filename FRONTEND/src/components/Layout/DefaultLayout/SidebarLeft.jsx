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
import Divider from "@mui/material/Divider";

import Sidebar from "../components/SidebarLeft";

import Paper from "~/components/Paper";
import Avatar from "~/components/Avatar";
import { NavLink } from "react-router-dom";

// PaperFrist
function PaperFrist() {
  return (
    <Paper>
      <Grid container rowSpacing={1}>
        <Grid item xs={3}>
          <Avatar br={2} size="48px" />
        </Grid>

        <Grid item xs={9}>
          <Typography variant="body1" fontWeight={700}>
            Furina Amasawa
          </Typography>
          <Typography variant="body2">@furinaamasawa</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}

// PaperSecond
function PaperSecond() {
  const currentUrl = window.location.pathname;

  // Thiết lập giá trị mặc định cho selectedIndex dựa trên đường dẫn URL
  let i = 0;
  const tabs = [
    { label: "Home", path: "/", icon: <HomeIcon />, custom: false },
    { label: "Video", path: "/video", icon: <VideoIcon />, custom: false },
    { label: "Group", path: "/group", icon: <GroupsIcon />, custom: true },
    { label: "Store", path: "/store", icon: <StoreIcon />, custom: false },
  ];

  // Thay đổi từ vòng lặp tăng dần sang vòng lặp giảm dần
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
}
// PaperThird
function PaperThird() {
  return <Paper></Paper>;
}

function SidebarLeft({ xs = {} }) {
  return (
    <Sidebar xs={xs}>
      <PaperFrist />
      <PaperSecond />
      <PaperThird />
    </Sidebar>
  );
}

export default SidebarLeft;
