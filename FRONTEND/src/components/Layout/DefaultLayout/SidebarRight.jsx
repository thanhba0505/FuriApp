/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react";
import Sidebar from "../components/SidebarRight";
import Paper from "~/components/Paper";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MessageIcon from "@mui/icons-material/Message";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";
import ReplayTwoToneIcon from "@mui/icons-material/ReplayTwoTone";
import DoneTwoToneIcon from "@mui/icons-material/DoneTwoTone";
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
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
} from "@mui/material";
import {
  acceptFriendRequest,
  getFriends,
  getNonFriends,
  getReceivedFriendRequests,
  rejectFriendRequest,
  sendFriendRequest,
} from "~/api/accountApi";
import { useNavigate } from "react-router-dom";
import { getImageBlob } from "~/api/imageApi";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import { io } from "socket.io-client";

// First
const ItemFirst = React.memo(({ index, item, setListItems }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const accountId = account?._id;
  const navigate = useNavigate();
  const [img, setImg] = useState();
  const [read, setRead] = useState(item?.hasRead);

  const handleLinkProfile = () => {
    navigate("/profile/" + item.account._id);
  };

  const handleLinkMessage = () => {
    navigate("/message/" + item?.conversation);
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, item.account.avatar);
        if (result.status == 200) {
          setImg(result.url);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (item.account.avatar && accessToken) {
      fetchImage();
    }
  }, [item.account.avatar, accessToken]);

  useEffect(() => {
    if (item?.conversation) {
      const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

      socket.on("newMess" + item?.conversation + accountId, ({ read }) => {
        if (!read) {
          setRead(false);
        } else {
          setRead(true);
        }
      });

      socket.on("newMess" + item?.conversation, ({ newMessage }) => {
        console.log(newMessage);
        if (newMessage?.sender?._id != accountId) {
          setRead(false);
        } else {
          setRead(true);
        }
        setListItems((prevItems) => {
          const updatedItems = [...prevItems];
          const index = updatedItems.findIndex(
            (i) => i.conversation === item?.conversation
          );
          if (index !== -1) {
            const movedItem = updatedItems.splice(index, 1)[0];
            return [movedItem, ...updatedItems];
          }
          return updatedItems;
        });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [item?.conversation, accountId, setListItems]);

  return (
    <>
      <ListItem
        key={index}
        disablePadding
        secondaryAction={
          <>
            <IconButton
              sx={{ width: "40px", height: "40px" }}
              onClick={handleLinkMessage}
            >
              <Badge color="secondary" variant={read ? "" : "dot"} max={10}>
                <MessageIcon />
              </Badge>
            </IconButton>
          </>
        }
      >
        <ListItemButton
          onClick={handleLinkProfile}
          sx={{
            pl: "8px !important",
            pr: "60px !important",
            py: "4px !important",
          }}
        >
          <ListItemAvatar sx={{ minWidth: "44px" }}>
            <Avatar src={img ? img : ""} sx={{ width: "32px", height: "32px" }}>
              {img ? "" : getFirstLetterUpperCase(item.account.fullname)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.account.fullname}
            secondary={"@" + item.account.username}
          />
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
  const limit = 100;
  const navigate = useNavigate();

  const [listItems, setListItems] = useState([]);
  const [maxHeight, setMaxHeight] = useState("200px");

  useEffect(() => {
    if (accessToken) {
      const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

      socket.on("newFriendReceiver" + accountId, ({ newFriendReceiver }) => {
        setListItems((prev) => [newFriendReceiver, ...prev]);
      });
      socket.on("newFriendSender" + accountId, ({ newFriendSender }) => {
        setListItems((prev) => [newFriendSender, ...prev]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [accountId, setListItems, accessToken]);

  useEffect(() => {
    const loadRequest = async () => {
      const res = await getFriends(accessToken, limit);
      if (res.status == 200) {
        setListItems(res.friends);
      }
    };
    if (accessToken) {
      loadRequest();
    }
  }, [accessToken]);

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
                    setListItems={setListItems}
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
const ItemSecond = React.memo(({ index, item, setListItems }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  const navigate = useNavigate();

  const [img, setImg] = useState();

  const handleLinkProfile = () => {
    navigate("/profile/" + item._id);
  };

  const removeItem = () => {
    setListItems((prev) => {
      const newArray = prev.filter((prevItem) => prevItem._id !== item._id);
      return newArray;
    });
  };

  const handleAccept = async () => {
    const senderId = item._id;
    const res = await acceptFriendRequest(accessToken, senderId);
    if (res.status == 200) {
      removeItem();
    } else {
      console.log({ res });
    }
  };

  const handleReject = async () => {
    const senderId = item._id;
    const res = await rejectFriendRequest(accessToken, senderId);
    if (res.status == 200) {
      removeItem();
    } else {
      console.log({ res });
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, item.avatar);
        if (result.status == 200) {
          setImg(result.url);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (item.avatar && accessToken) {
      fetchImage();
    }
  }, [item.avatar, accessToken]);

  return (
    <>
      <ListItem
        key={index}
        disablePadding
        secondaryAction={
          <>
            <IconButton
              onClick={handleReject}
              sx={{ width: "40px", height: "40px" }}
              edge="end"
            >
              <CancelTwoToneIcon />
            </IconButton>

            <IconButton
              onClick={handleAccept}
              sx={{ width: "40px", height: "40px" }}
              edge="end"
            >
              <CheckCircleTwoToneIcon />
            </IconButton>
          </>
        }
      >
        <ListItemButton
          onClick={handleLinkProfile}
          sx={{
            pl: "8px !important",
            pr: "72px !important",
            py: "4px !important",
          }}
        >
          <ListItemAvatar sx={{ minWidth: "44px" }}>
            <Avatar src={img ? img : ""} sx={{ width: "32px", height: "32px" }}>
              {img ? "" : getFirstLetterUpperCase(item.fullname)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.fullname}
            secondary={"@" + item.username}
          />
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
});

const PaperSecond = React.memo(() => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const limit = 5;
  const navigate = useNavigate();

  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    const loadRequest = async () => {
      const res = await getReceivedFriendRequests(accessToken, limit);
      if (res.status == 200) {
        setListItems(res.receivedFriendRequests);
      }
    };
    if (accessToken) {
      loadRequest();
    }
  }, [accessToken]);

  const handleLinkReceived = () => {
    navigate("/everyone/received");
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
            Request received
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <List
            sx={{
              maxHeight: 350,
              overflowY: "auto",
              pr: "4px",
              py: 1,
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
                <ItemSecond
                  key={item?._id}
                  item={item}
                  setListItems={setListItems}
                />
              ))
            ) : (
              <Typography py={2} textAlign={"center"}>
                No request received
              </Typography>
            )}
          </List>
          <Box mt={1} display={"flex"} gap={1}>
            <Button
              onClick={handleLinkReceived}
              variant="outlined"
              color="secondary"
              sx={{ width: "100%" }}
            >
              See all friend request
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
});

// Third
const ItemThird = React.memo(({ index, item }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  const navigate = useNavigate();

  const [check, setCheck] = useState(false);
  const [img, setImg] = useState();

  useEffect(() => {
    if (check) {
      setCheck(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const handleLinkProfile = () => {
    navigate("/profile/" + item._id);
  };

  const handleSendRequest = async () => {
    if (!check) {
      const receiverId = item._id;
      const res = await sendFriendRequest(accessToken, receiverId);
      if (res.status == 200) {
        setCheck(true);
      } else {
        console.log(res);
      }
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, item.avatar);
        if (result.status == 200) {
          setImg(result.url);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (item.avatar && accessToken) {
      fetchImage();
    }
  }, [item.avatar, accessToken]);

  return (
    <>
      <ListItem
        key={index}
        disablePadding
        secondaryAction={
          <>
            <IconButton
              onClick={handleSendRequest}
              sx={{ width: "40px", height: "40px" }}
            >
              {check ? (
                <DoneTwoToneIcon sx={{ mr: "1px" }} />
              ) : (
                <PersonAddAltTwoToneIcon />
              )}
            </IconButton>
          </>
        }
      >
        <ListItemButton
          onClick={handleLinkProfile}
          sx={{
            pl: "8px !important",
            pr: "60px !important",
            py: "4px !important",
          }}
        >
          <ListItemAvatar sx={{ minWidth: "44px" }}>
            <Avatar src={img ? img : ""} sx={{ width: "32px", height: "32px" }}>
              {img ? "" : getFirstLetterUpperCase(item.fullname)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.fullname}
            secondary={"@" + item.username}
          />
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
});

const PaperThird = React.memo(() => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const limit = 5;
  const navigate = useNavigate();

  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    const loadRequest = async () => {
      const res = await getNonFriends(accessToken, limit);
      if (res.status == 200) {
        setListItems(res.nonFriends);
      }
    };
    if (accessToken) {
      loadRequest();
    }
  }, [accessToken]);

  const handleReload = () => {
    const loadRequest = async () => {
      const res = await getNonFriends(accessToken, limit);
      if (res.status == 200) {
        setListItems(res.nonFriends);
      }
    };
    loadRequest();
  };

  const handleLinkEveryone = () => {
    navigate("/everyone");
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
            Everyone
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <List>
            {listItems && listItems.length > 0
              ? listItems.map((item) => (
                  <ItemThird key={item?._id} item={item}></ItemThird>
                ))
              : "Nobody"}
          </List>
          <Box mt={1} display={"flex"} gap={1}>
            <Button
              variant="outlined"
              color="secondary"
              sx={{ width: "30%" }}
              onClick={handleReload}
            >
              <ReplayTwoToneIcon fontSize="small" />
            </Button>
            <Button
              onClick={handleLinkEveryone}
              variant="outlined"
              color="secondary"
              sx={{ width: "70%" }}
            >
              See more
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
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
