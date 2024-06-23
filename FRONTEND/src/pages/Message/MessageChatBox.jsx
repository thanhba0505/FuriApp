import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getConversation } from "~/api/conversationApi";
import { getImageBlob } from "~/api/imageApi";
import Paper from "~/components/Paper";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";
import SendIcon from "@mui/icons-material/Send";

const TotalAvatars = ({ participants }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const [avatarParticipants, setAvatarParticipants] = useState([]);

  const fetchImage = useCallback(
    async (avatar) => {
      try {
        const result = await getImageBlob(accessToken, avatar);
        if (result.status === 200) {
          return result.url;
        }
      } catch (error) {
        console.log({ error });
        return null;
      }
    },
    [accessToken]
  );

  useEffect(() => {
    const fetchAvatars = async () => {
      if (participants && accessToken) {
        const participantsWithAvatars = await Promise.all(
          participants.map(async (participant) => {
            if (participant.avatar) {
              const avatarBlob = await fetchImage(participant.avatar);
              return { ...participant, avatarBlob };
            }
            return participant;
          })
        );
        setAvatarParticipants(participantsWithAvatars);
      }
    };

    fetchAvatars();
  }, [participants, accessToken, fetchImage]);

  return (
    <Box>
      <AvatarGroup
        total={avatarParticipants && avatarParticipants.length}
        sx={{ justifyContent: "start" }}
        max={4}
      >
        {avatarParticipants &&
          avatarParticipants.map((participant) => (
            <Avatar
              sx={{ width: 24, height: 24, fontSize: 14 }}
              key={participant._id}
              alt={participant.fullname}
              src={
                participant.avatarBlob ||
                getFirstLetterUpperCase(participant.fullname)
              }
            />
          ))}
      </AvatarGroup>
    </Box>
  );
};

const MessageChatBox = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const { conversationId } = useParams();
  // const limit = 100;

  const [conversation, setConversation] = useState();

  useEffect(() => {
    const loadRequest = async () => {
      const res = await getConversation(accessToken, conversationId);
      if (res.status == 200) {
        setConversation(res.conversation);
        console.log(res.conversation);
      } else {
        console.log({ res });
      }
    };
    if (accessToken) {
      loadRequest();
    }
  }, [accessToken, conversationId]);

  return (
    <Paper h={"calc(100% - 24px)"} mh={800}>
      <Box display={"flex"} flexDirection={"column"} height={"100%"}>
        <Box display={"flex"} alignItems={"center"} height={30}>
          <Typography fontSize={18} fontWeight={700} lineHeight={1} mr={1}>
            {conversation && conversation.participants.length == 2
              ? conversation.participants[1].fullname
              : ""}
          </Typography>

          {conversation && (
            <TotalAvatars participants={conversation?.participants} />
          )}
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            borderRadius: 4,
            boxShadow:
              `inset 0px 2px 1px -1px rgba(0,0,0,0.11), 
              inset 0px 0px 2px 0px rgba(0,0,0,0.14), 
              inset 0px 1px 0px 0px rgba(0,0,0,0.05)`,
            overflow: "hidden",
          }}
          bgcolor={"custom.backgroundMessage"}
          mt={1}
          p={1}
        >
          s
        </Box>

        <Box mt={2} display={"flex"}>
          <TextField
            label={
              conversation && conversation.participants.length == 2
                ? "Enter message to " + conversation.participants[1].fullname
                : ""
            }
            multiline
            maxRows={4}
            size="small"
            sx={{ width: "80%", mr: 2 }}
          />
          <Button variant="contained" sx={{ px: 4 }} endIcon={<SendIcon />}>
            Send
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default MessageChatBox;
