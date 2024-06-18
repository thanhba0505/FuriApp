import { Avatar, Box, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getInfo } from "~/api/accountApi";
import { getImageBlob } from "~/api/imageApi";
import Paper from "~/components/Paper";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";
import Friends from "./Friends";

const fetchInfo = async (accessToken, accountId, setInfo) => {
  try {
    const result = await getInfo(accessToken, accountId);
    if (result.status === 200) {
      setInfo(result.account);
    } else {
      console.log({ result });
    }
  } catch (error) {
    console.log({ error });
  }
};

const fetchImage = async (accessToken, imagePath, setImageState) => {
  try {
    const result = await getImageBlob(accessToken, imagePath);
    if (result.status == 200) {
      setImageState(result.url);
    }
  } catch (error) {
    console.log({ error });
  }
};

const Profile = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const { accountId } = useParams();

  const [info, setInfo] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);
  const [backgroundImg, setBackgroundImg] = useState(null);

  useEffect(() => {
    if (accessToken) {
      fetchInfo(accessToken, accountId, setInfo);
      setAvatarImg(null); // Reset avatar image state
      setBackgroundImg(null); // Reset background image state
    }
  }, [accessToken, accountId]);

  useEffect(() => {
    if (info?.avatar && accessToken) {
      fetchImage(accessToken, info.avatar, setAvatarImg);
    }
  }, [accessToken, info?.avatar]);

  useEffect(() => {
    if (info?.background && accessToken) {
      fetchImage(accessToken, info.background, setBackgroundImg);
    }
  }, [accessToken, info?.background]);

  return (
    <>
      <Paper>
        <Box
          minHeight={200}
          sx={{
            backgroundImage: backgroundImg ? `url(${backgroundImg})` : "none",
            backgroundColor: backgroundImg ? "transparent" : "divider",
            backgroundSize: "cover",
            backgroundPosition: "center",
            borderRadius: 2,
            position: "relative",
          }}
        >
          <Avatar
            src={avatarImg ? avatarImg : ""}
            sx={{
              position: "absolute",
              height: 170,
              width: 170,
              bottom: -120,
              left: 30,
              border: "8px solid white",
              borderColor: "custom.background",
              userSelect: "none",
              fontSize: 60,
            }}
          >
            {avatarImg ? "" : getFirstLetterUpperCase(info?.fullname)}
          </Avatar>
        </Box>

        <Box minHeight={110} pl={28} pt={2}>
          <Typography variant="h5" fontWeight={600}>
            {info?.fullname}
          </Typography>
          <Typography variant="body1" mb={1}>
            @{info?.username}
          </Typography>
          <Typography variant="body2">{info?.friendCount} friends</Typography>
        </Box>
      </Paper>

      <Box display={"flex"} gap={3}>
        <Paper w="50%">
          <Typography>Biography</Typography>
        </Paper>
        <Friends friends={info?.friends} />
      </Box>
      <Paper></Paper>
    </>
  );
};

const ProfileMemo = React.memo(Profile);

export default ProfileMemo;
