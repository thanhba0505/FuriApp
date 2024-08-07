/* eslint-disable react/display-name */
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getConversation, sendMessage } from "~/api/conversationApi";
import Paper from "~/components/Paper";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";
import SendIcon from "@mui/icons-material/Send";
import formatTimeDifference from "~/config/formatTimeDifference";
import { io } from "socket.io-client";

const TotalAvatars = React.memo(({ participants }) => {
  return (
    <Box>
      <AvatarGroup
        total={participants && participants.length}
        sx={{ justifyContent: "start" }}
        max={4}
      >
        {participants &&
          participants.map((participant) => (
            <Avatar
              sx={{ width: 24, height: 24, fontSize: 14 }}
              key={participant._id}
              alt={participant.fullname}
              src={participant.avatar ? participant.avatar : null}
            >
              {!participant.avatar &&
                getFirstLetterUpperCase(participant.fullname)}
            </Avatar>
          ))}
      </AvatarGroup>
    </Box>
  );
});

const BoxMessage = React.memo(({ message }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accountId = account?._id;
  const navigate = useNavigate();

  const isCurrentAccount = accountId === message?.sender._id;

  return (
    <Box
      mt={2}
      display={"flex"}
      flexDirection={isCurrentAccount ? "row-reverse" : ""}
    >
      <Avatar
        onClick={() => navigate("/profile/" + message?.sender._id)}
        src={message?.sender.avatar ? message.sender.avatar : ""}
        sx={{ cursor: "pointer" }}
      >
        {!message.sender.avatar
          ? getFirstLetterUpperCase(message.sender.fullname)
          : ""}
      </Avatar>

      <Box ml={!isCurrentAccount && 2} mr={isCurrentAccount && 2}>
        <Paper mt={0} p={1.6} minW={100} maxW={400}>
          <Typography
            lineHeight={1}
            variant="body2"
            fontSize={10}
            fontWeight={400}
            textAlign={isCurrentAccount ? "right" : "left"}
          >
            {message?.sender.fullname}
          </Typography>

          <Typography
            lineHeight={1}
            mt={1}
            textAlign={isCurrentAccount ? "right" : "left"}
          >
            {message?.content}
          </Typography>
        </Paper>

        <Typography
          lineHeight={1}
          mt={1}
          px={1}
          textAlign={isCurrentAccount ? "right" : "left"}
          variant="body2"
          fontSize={10}
        >
          {formatTimeDifference(message.updatedAt)}
        </Typography>
      </Box>
    </Box>
  );
});

const ListMessages = React.memo(({ messages, participants }) => {
  if (messages) {
    messages.forEach((message) => {
      const sender = participants.find(
        (participant) => participant._id === message.sender._id
      );
      if (sender) {
        message.sender.avatarBlob = sender.avatarBlob;
      }
    });
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        borderRadius: 4,
        boxShadow: `inset 0px 2px 1px -1px rgba(0,0,0,0.11), 
      inset 0px 0px 2px 0px rgba(0,0,0,0.14), 
      inset 0px 1px 0px 0px rgba(0,0,0,0.05)`,
        overflow: "hidden",
      }}
      bgcolor={"custom.backgroundMessage"}
      mt={2}
      p={2}
      pr={0}
    >
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
          height: "100%",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column-reverse",
          justifyContent: "end",
          // py: "1px",
          pr: 2,
        }}
      >
        {messages &&
          messages.map((message) => (
            <BoxMessage key={message._id} message={message} />
          ))}

        {messages?.length == 0 && (
          <Typography
            height={"100%"}
            alignContent={"center"}
            textAlign={"center"}
          >
            No messages yet, start chatting now!
          </Typography>
        )}
      </Box>
    </Box>
  );
});

const MessageChatBox = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const accountId = account?._id;

  const navigate = useNavigate();
  const { conversationId } = useParams();

  const [conversation, setConversation] = useState();
  const [textMessage, setTextMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchApi = useCallback(async () => {
    const res = await getConversation(accessToken, conversationId);

    if (res.status === 200) {
      setConversation(res.conversation);
    } else {
      navigate("/message");
    }
  }, [accessToken, conversationId, navigate]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      await fetchApi();
      setLoading(false);
    };

    if (accessToken && conversationId) {
      load();
    }
  }, [accessToken, conversationId, fetchApi]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

    socket.on("newMess" + accountId, ({ conversation }) => {
      if (conversationId == conversation) {
        fetchApi();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [accountId, conversationId, fetchApi]);

  const handleSendMessage = () => {
    const fetchApi = async () => {
      try {
        const content = textMessage;
        const res = await sendMessage(accessToken, conversationId, content);

        if (res.status == 200) {
          setTextMessage("");
        } else {
          console.log({ res });
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (
      accessToken &&
      conversationId &&
      textMessage &&
      textMessage.trim() !== ""
    ) {
      fetchApi();
    } else {
      setTextMessage("");
    }
  };

  return (
    <Paper h={"calc(100% - 24px)"}>
      <Box display={"flex"} flexDirection={"column"} height={"100%"}>
        {!loading ? (
          <>
            <Box display={"flex"} alignItems={"center"} height={30}>
              <Typography fontSize={18} fontWeight={700} lineHeight={1} mr={1}>
                {conversation && conversation.participants.length === 2
                  ? conversation.participants[1].fullname
                  : ""}
              </Typography>

              {conversation && (
                <TotalAvatars participants={conversation.participants} />
              )}
            </Box>

            <ListMessages
              messages={conversation?.messages}
              participants={conversation?.participants}
            />

            <Box mt={2} display={"flex"} alignItems={"end"}>
              <TextField
                label={
                  conversation && conversation.participants.length === 2
                    ? "Enter message to " +
                      conversation.participants[1].fullname
                    : ""
                }
                multiline
                maxRows={4}
                size="small"
                sx={{ width: "80%", mr: 2 }}
                onChange={(e) => setTextMessage(e.target.value)}
                value={textMessage}
              />
              <Button
                onClick={handleSendMessage}
                variant="contained"
                sx={{ px: 4, maxHeight: 40, height: 40 }}
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </Box>
          </>
        ) : (
          <Box
            textAlign={"center"}
            alignContent={"center"}
            mt={4}
            mb={4}
            minHeight={400}
          >
            <Box >
              <CircularProgress />
            </Box>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

const MessageChatBoxMemo = React.memo(MessageChatBox);

export default MessageChatBoxMemo;
