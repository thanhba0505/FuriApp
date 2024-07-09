/* eslint-disable react/display-name */
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
  const navigate = useNavigate();

  const socketRef = useRef(null);

  useEffect(() => {
    if (accessToken && item?.conversation) {
      const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

      socket.on("newMess" + item?.conversation, () => {
        fetchApi();
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }
      };
    }
  }, [accessToken, fetchApi, item?.conversation]);

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
              src={item?.account?.avatar ? item?.account?.avatar : ""}
              sx={{ width: "40px", height: "40px", mr: 2 }}
            >
              {item?.account?.avatar
                ? ""
                : getFirstLetterUpperCase(item?.account?.fullname)}
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

  const [listItems, setListItems] = useState();
  const [loading, setLoading] = useState(false);

  const fetchApi = useCallback(async () => {
    if (accessToken) {
      setLoading(true);
      const res = await getFriends(accessToken);
      if (res.status == 200) {
        setListItems(() => res.friends);
      } else {
        console.log({ res });
      }
      setLoading(false);
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
      <Paper h={"calc(100% - 24px)"} mh={800}>
        <Typography fontSize={18} fontWeight={700} lineHeight={1} mb={2}>
          Message
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
          <Box mt={listItems && listItems.length && 2}>
            {listItems && listItems.length > 0 ? (
              listItems.map((item) => (
                <Conversation
                  key={item?.conversation}
                  item={item}
                  fetchApi={fetchApi}
                />
              ))
            ) : (
              <Typography
                textAlign={"center"}
                mt={3}
                mb={4}
                minHeight={400}
                alignContent={"center"}
              >
                {loading && <CircularProgress />}
                {!loading && listItems?.length == 0 && "No message"}
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </>
  );
};

const ListConversationMemo = React.memo(ListConversation);

export default ListConversationMemo;
