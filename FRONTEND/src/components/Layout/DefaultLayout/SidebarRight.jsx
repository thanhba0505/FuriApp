/* eslint-disable react/display-name */
import React, { useCallback, useEffect, useState } from "react";
import Sidebar from "../components/SidebarRight";
import Paper from "~/components/Paper";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MessageIcon from "@mui/icons-material/Message";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Typography,
} from "@mui/material";
import { getFriends } from "~/api/accountApi";
import { useNavigate, useParams } from "react-router-dom";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { io } from "socket.io-client";
import EllipsisTypography from "~/components/EllipsisTypography";

// First
const ItemFirst = React.memo(({ item }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const currentAccountId = account?._id;

  const navigate = useNavigate();
  const { conversationId, accountId } = useParams();

  return (
    <>
      <ListItem
        disablePadding
        secondaryAction={
          <>
            <IconButton
              sx={{ width: "40px", height: "40px" }}
              onClick={() => navigate("/message/" + item?.conversation)}
            >
              <Badge
                color="secondary"
                variant={item && item.hasRead ? "" : "dot"}
                max={10}
                sx={{
                  "& .MuiBadge-dot": {
                    minHeight: 12,
                    minWidth: 12,
                    backgroundColor: "info.dark",
                  },
                }}
              >
                <MessageIcon />
              </Badge>
            </IconButton>
          </>
        }
      >
        <ListItemButton
          selected={
            item?.conversation == conversationId ||
            item?.account._id == accountId
          }
          onClick={() => navigate("/profile/" + item?.account._id)}
          sx={{
            pl: "8px !important",
            pr: "60px !important",
            py: "10px !important",
          }}
        >
          <ListItemAvatar sx={{ minWidth: "44px" }}>
            <Avatar
              src={item?.account?.avatar ? item?.account?.avatar : ""}
              sx={{ width: "32px", height: "32px" }}
            >
              {item?.account?.avatar
                ? ""
                : getFirstLetterUpperCase(item?.account?.fullname)}
            </Avatar>
          </ListItemAvatar>

          <Box>
            <EllipsisTypography fontWeight={500}>{item?.account?.fullname}</EllipsisTypography>
            <EllipsisTypography
              color={"text.secondary"}
              fontSize={14}
              width={"unset"}
            >
              {item && item.lastMessage
                ? (item.lastMessage.senderId == currentAccountId
                    ? "You"
                    : item.lastMessage.senderName) +
                  ": " +
                  item.lastMessage.content
                : "No message"}
            </EllipsisTypography>
          </Box>
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
});

const PaperFirst = React.memo(() => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const accountId = account?._id;
  const navigate = useNavigate();

  const [listItems, setListItems] = useState([]);
  const [maxHeight, setMaxHeight] = useState("200px");

  const fetchApi = useCallback(async () => {
    if (accessToken) {
      const res = await getFriends(accessToken);
      if (res.status == 200) {
        setListItems(() => res.friends);
      } else {
        console.log({ res });
      }
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchApi();
    }
  }, [accessToken, fetchApi]);

  useEffect(() => {
    if (accessToken) {
      const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

      socket.on("newFriend" + accountId, fetchApi);
      socket.on("seenMess" + accountId, fetchApi);
      socket.on("newMess" + accountId, fetchApi);

      return () => {
        socket.disconnect();
      };
    }
  }, [accountId, accessToken, fetchApi]);

  const handleLinkMessage = () => {
    navigate("/message");
  };

  const handleLinkFriends = () => {
    navigate("/everyone/friends");
  };

  const handleMaxHeight = () => {
    if (maxHeight == "200px") {
      setMaxHeight("460px");
    } else {
      setMaxHeight("200px");
    }
  };

  return (
    <Paper>
      <Accordion
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          boxShadow: "none",
          padding: "0",
          ".MuiButtonBase-root": {
            padding: "0",
          },
          ".MuiAccordionSummary-content": {
            margin: "0 !important",
            alignItems: "start",
            gap: (theme) => theme.spacing(2),
          },
          ".MuiAccordionDetails-root": {
            paddingX: 0,
          },
        }}
        defaultExpanded
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          sx={{ minHeight: "30px !important" }}
        >
          <Typography variant="body1" fontSize={18} fontWeight={700}>
            My friends
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <Box
            sx={{
              py: 1,
            }}
          >
            <List
              sx={{
                maxHeight: { maxHeight },
                overflowY: "auto",
                pr: "4px",
                py: 0,
                "::-webkit-scrollbar": {
                  width: "4px",
                  height: "8px",
                  backgroundColor: "action.hover",
                },
                "::-webkit-scrollbar-thumb": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              {listItems && listItems.length > 0 ? (
                listItems.map((item) => (
                  <ItemFirst
                    key={item?.conversation}
                    item={item}
                    fetchApi={fetchApi}
                  ></ItemFirst>
                ))
              ) : (
                <Typography py={2} textAlign={"center"}>
                  No friend
                </Typography>
              )}
            </List>
          </Box>
          <Box mt={1} display={"flex"} gap={1}>
            <Button
              onClick={handleMaxHeight}
              variant="outlined"
              color="secondary"
              sx={{ width: "30%" }}
            >
              {maxHeight == "200px" ? (
                <ArrowDropDownIcon />
              ) : (
                <ArrowDropUpIcon />
              )}
            </Button>
            <Button
              onClick={handleLinkFriends}
              variant="outlined"
              color="secondary"
              sx={{ width: "35%" }}
            >
              Friends
            </Button>
            <Button
              onClick={handleLinkMessage}
              variant="outlined"
              color="secondary"
              sx={{ width: "35%" }}
            >
              Messages
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
});

// Second
// const ItemSecond = React.memo(() => {});

const PaperSecond = React.memo(() => {
  return <Paper>Coming soon</Paper>;
});

// Third
// const ItemThird = React.memo(() => {});

const PaperThird = React.memo(() => {
  return <Paper>Coming soon</Paper>;
});

const SidebarRight = ({ xs = {} }) => {
  return (
    <Sidebar xs={xs}>
      <PaperFirst />
      <PaperSecond />
      <PaperThird />
    </Sidebar>
  );
};

const SidebarRightMemo = React.memo(SidebarRight);

export default SidebarRightMemo;
