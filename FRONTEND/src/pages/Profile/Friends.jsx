import { Avatar, Grid, Typography } from "@mui/material";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getImageBlob } from "~/api/imageApi";
import Paper from "~/components/Paper";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";

const Friend = ({ friend }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const [img, setImg] = useState();
  const navigate = useNavigate();

  const fetchImage = useCallback(async () => {
    try {
      const result = await getImageBlob(accessToken, friend.avatar);
      if (result.status === 200) {
        setImg(result.url);
      }
    } catch (error) {
      console.log({ error });
    }
  }, [accessToken, friend.avatar]);

  useEffect(() => {
    if (friend.avatar && accessToken) {
      fetchImage();
    }
  }, [fetchImage, friend.avatar, accessToken]);

  const handleLinkAccount = () => {
    navigate("/profile/" + friend._id);
  };

  return (
    <Grid item xs={4}>
      <Avatar
        onClick={handleLinkAccount}
        src={img ? img : " "}
        sx={{ height: 60, width: 60, margin: "auto", cursor: "pointer" }}
      >
        {img ? "" : getFirstLetterUpperCase(friend.fullname)}
      </Avatar>
      <Typography
        textAlign="center"
        fontSize={14}
        sx={{ mt: "4px" }}
        lineHeight={1.1}
      >
        {friend.fullname}
      </Typography>
    </Grid>
  );
};

const Friends = ({ friends }) => {
  return (
    <Paper w="50%">
      <Typography fontSize={20} lineHeight={1} fontWeight={"500"}>
        Friends
      </Typography>
      <Grid container wrap="wrap" spacing={1} mt={1}>
        {friends && friends.length > 0 ? (
          friends.map((friend) => <Friend key={friend._id} friend={friend} />)
        ) : (
          <Grid item xs textAlign={"center"}>
            No friends
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default Friends;
