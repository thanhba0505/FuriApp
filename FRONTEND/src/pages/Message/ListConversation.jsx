/* eslint-disable react/display-name */
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { getFriends } from "~/api/accountApi";
import { getImageBlob } from "~/api/imageApi";
import Paper from "~/components/Paper";
import formatTimeDifference from "~/config/formatTimeDifference";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";

const Conversation = React.memo(({ item, setListItems }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const accountId = account?._id;
  const navigate = useNavigate();
  const [img, setImg] = useState();
  const [read, setRead] = useState(item?.hasRead);

  const [newLastMessage, setNewLastMessage] = useState({
    send: item?.lastMessage?.senderName ? item.lastMessage.senderName : null,
    mess: item?.lastMessage?.content ? item.lastMessage.content : null,
    date: item?.lastMessage?.createdAt ? item.lastMessage.createdAt : null,
  });

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
        if (newMessage?.sender?._id != accountId) {
          setRead(false);
          setNewLastMessage({
            send: newMessage?.sender?.fullname,
            mess: newMessage?.content,
            date: newMessage?.updatedAt,
          });
          setListItems((prevItems) => {
            const updatedItems = [...prevItems];
            const index = updatedItems.findIndex(
              (i) => i.conversation === item.conversation
            );
            if (index !== -1) {
              const movedItem = updatedItems.splice(index, 1)[0];
              return [movedItem, ...updatedItems];
            }
            return updatedItems;
          });
        } else {
          setRead(true);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [item.conversation, accountId, setListItems]);

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

  const handleLinkMessage = () => {
    navigate("/message/" + item.conversation);
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleLinkMessage}
          sx={{
            pl: "16px !important",
            py: "8px !important",
          }}
        >
          <ListItemAvatar>
            <Avatar
              src={img ? img : ""}
              sx={{ width: "40px", height: "40px", mr: 2 }}
            >
              {img ? "" : getFirstLetterUpperCase(item.account.fullname)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item?.account?.fullname}
            secondary={
              newLastMessage?.mess && newLastMessage?.send
                ? newLastMessage.send + ": " + newLastMessage.mess
                : "@" + item.account.username
            }
          />
          <ListItemText
            sx={{ textAlign: "end" }}
            primary={read ? "" : "New message"}
            secondary={
              newLastMessage?.date && formatTimeDifference(newLastMessage.date)
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
});

const ListConversation = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const accountId = account?._id;
  const limit = 100;

  const [listItems, setListItems] = useState([]);

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

  return (
    <Paper>
      <Typography fontSize={18} fontWeight={700} lineHeight={1}>
        Message
      </Typography>

      <Box mt={2}>
        {listItems &&
          listItems.length > 0 &&
          listItems.map((item) => (
            <Conversation
              key={item?.conversation}
              item={item}
              setListItems={setListItems}
            />
          ))}
      </Box>
    </Paper>
  );
};

const ListConversationMemo = React.memo(ListConversation);

export default ListConversationMemo;
