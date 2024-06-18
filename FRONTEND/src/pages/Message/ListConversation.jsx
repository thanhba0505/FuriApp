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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFriends } from "~/api/accountApi";
import { getImageBlob } from "~/api/imageApi";
import Paper from "~/components/Paper";
import formatTimeDifference from "~/config/formatTimeDifference";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";

const Conversation = ({ item }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const navigate = useNavigate();
  const [img, setImg] = useState();

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

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          // onClick={handleLinkProfile}
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
              item?.lastMessage
                ? item.lastMessage.senderName + ": " + item.lastMessage.content
                : "@" + item.account.username
            }
          />
          <ListItemText
            sx={{ textAlign: "end" }}
            primary={
              item?.unreadMessagesCount
                ? item?.unreadMessagesCount + " new message"
                : ""
            }
            secondary={
              item?.lastMessage &&
              formatTimeDifference(item.lastMessage.createdAt)
            }
          />
        </ListItemButton>
      </ListItem>
      <Divider />
    </>
  );
};

const ListConversation = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const limit = 100;
  const navigate = useNavigate();

  const [listItems, setListItems] = useState([]);

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
  console.log(listItems);
  return (
    <Paper>
      <Typography fontSize={18} fontWeight={700} lineHeight={1}>
        Message
      </Typography>

      <Box mt={2}>
        {listItems &&
          listItems.length > 0 &&
          listItems.map((item) => (
            <Conversation key={item.conversation} item={item} />
          ))}
      </Box>
    </Paper>
  );
};

export default ListConversation;
