/* eslint-disable react/display-name */
import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { getFriends } from "~/api/accountApi";
import { getImageBlob } from "~/api/imageApi";
import EllipsisTypography from "~/components/EllipsisTypography";
import Paper from "~/components/Paper";
import formatTimeDifference from "~/config/formatTimeDifference";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";

const Conversation = React.memo(({ item, fetchApi }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const accountId = account?._id;
  const navigate = useNavigate();
  const [img, setImg] = useState();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, item?.account?.avatar);
        if (result.status == 200) {
          setImg(result.url);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (item?.account?.avatar && accessToken) {
      fetchImage();
    }
  }, [item?.account?.avatar, accessToken]);

  useEffect(() => {
    if (accessToken && item?.conversation) {
      const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

      socket.on("newMess" + item?.conversation, () => {
        fetchApi();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [accountId, accessToken, fetchApi, item?.conversation]);

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={() => navigate("/message/" + item?.conversation)}
          sx={{
            pl: "16px !important",
            py: "12px !important",
          }}
        >
          <ListItemAvatar>
            <Avatar
              src={img ? img : ""}
              sx={{ width: "40px", height: "40px", mr: 2 }}
            >
              {img ? "" : getFirstLetterUpperCase(item?.account?.fullname)}
            </Avatar>
          </ListItemAvatar>

          <Box>
            <Typography fontWeight={500}>{item?.account?.fullname}</Typography>
            <EllipsisTypography
              color={"text.secondary"}
              fontSize={14}
              width={"unset"}
            >
              {item && item.lastMessage
                ? item.lastMessage.senderName + ": " + item.lastMessage.content
                : "No message"}
            </EllipsisTypography>
          </Box>

          <Box flex={2} textAlign={"end"} minWidth={"20%"}>
            <Typography fontSize={14} fontWeight={450}>
              {item?.hasRead ? "" : "New message"}
            </Typography>
            <Typography color={"text.secondary"} fontSize={14} width={"unset"}>
              {item && item.lastMessage
                ? formatTimeDifference(item.lastMessage.createdAt)
                : formatTimeDifference(item.conversationCreatedAt)}
            </Typography>
          </Box>
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
  const navigate = useNavigate();

  const [listItems, setListItems] = useState([]);

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

      return () => {
        socket.disconnect();
      };
    }
  }, [accountId, accessToken, fetchApi]);

  return (
    <>
      <Paper>
        <Typography fontSize={18} fontWeight={700} lineHeight={1}>
          Message
        </Typography>

        <Box mt={listItems && listItems.length && 2}>
          {listItems &&
            listItems.length > 0 &&
            listItems.map((item) => (
              <Conversation
                key={item?.conversation}
                item={item}
                fetchApi={fetchApi}
              />
            ))}
        </Box>
      </Paper>

      {listItems && listItems.length == 0 && (
        <Paper>
          <Typography textAlign={"center"} mt={10}>
            No messages, add new friends now!
          </Typography>
          <Box textAlign={"center"} mt={3} mb={10}>
            <Button variant="contained" onClick={() => navigate("/everyone")}>
              Find everyone
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
};

const ListConversationMemo = React.memo(ListConversation);

export default ListConversationMemo;
