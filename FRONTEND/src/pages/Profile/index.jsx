/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getInfo, uploadAvatar, uploadBackground } from "~/api/accountApi";
import { getImageBlob } from "~/api/imageApi";
import Paper from "~/components/Paper";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";
import PeopleAltTwoToneIcon from "@mui/icons-material/PeopleAltTwoTone";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MessageIcon from "@mui/icons-material/Message";
import CancelIcon from "@mui/icons-material/Cancel";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ScheduleSendTwoToneIcon from "@mui/icons-material/ScheduleSendTwoTone";
import FaceIcon from "@mui/icons-material/Face";
import Friends from "./Friends";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import { enqueueSnackbar } from "notistack";
import ImageUploadDialog from "~/components/ImageUploadDialog";

const fetchInfo = async (accessToken, accountId, setInfo, navigate) => {
  try {
    const result = await getInfo(accessToken, accountId);
    if (result.status === 200) {
      setInfo(result.account);
    } else {
      navigate("/");
    }
    return result;
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

const BtnCurrentUser = memo(({ setAvatarImg, setBackgroundImg }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  const [openDialog, setOpenDialog] = useState(false);
  const [imageType, setImageType] = useState(null);

  const handleUpload = async (selectedFile) => {
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      let res;
      if (imageType === "avatar") {
        res = await uploadAvatar(accessToken, formData);
        if (res.status === 201) {
          fetchImage(accessToken, res.avatar, setAvatarImg);
        }
      } else if (imageType === "background") {
        res = await uploadBackground(accessToken, formData);
        if (res.status === 201) {
          fetchImage(accessToken, res.background, setBackgroundImg);
        }
      }

      if (res.status === 201) {
        enqueueSnackbar(res.message, {
          variant: "success",
        });
      } else {
        enqueueSnackbar(res.message, {
          variant: "error",
        });
      }
    } catch (error) {
      console.log({ error });
      enqueueSnackbar("Upload failed", {
        variant: "error",
      });
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        color="primary"
        size="small"
        sx={{ mr: 1 }}
        endIcon={<FaceIcon />}
        onClick={() => {
          setImageType("avatar");
          setOpenDialog(true);
        }}
      >
        Set avatar
      </Button>

      <Button
        variant="contained"
        color="primary"
        size="small"
        endIcon={<WallpaperIcon />}
        onClick={() => {
          setImageType("background");
          setOpenDialog(true);
        }}
      >
        Set background
      </Button>

      <ImageUploadDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onUpload={handleUpload}
        title={imageType === "avatar" ? "Set avatar" : "Set background"}
      />
    </>
  );
});

const BtnFriend = memo(({ info, setAvatarImg, setBackgroundImg }) => {
  const navigate = useNavigate();

  const handleMessage = () => {
    navigate("/message/" + info.conversationId);
  };

  if (info?.isCurrentUser) {
    return (
      <BtnCurrentUser
        setAvatarImg={setAvatarImg}
        setBackgroundImg={setBackgroundImg}
      />
    );
  } else if (info?.isFriend) {
    return (
      <>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          sx={{ mr: 1 }}
          endIcon={<MessageIcon />}
          onClick={handleMessage}
        >
          Message
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          endIcon={<PeopleAltTwoToneIcon />}
        >
          Already friends
        </Button>
      </>
    );
  } else if (info?.hasSentFriendRequest) {
    return (
      <>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          sx={{ mr: 1 }}
          endIcon={<ScheduleSendTwoToneIcon />}
        >
          Sent
        </Button>
      </>
    );
  } else if (info?.hasReceivedFriendRequest) {
    return (
      <>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          sx={{ mr: 1 }}
          endIcon={<CancelIcon />}
        >
          Reject
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="small"
          endIcon={<CheckCircleIcon />}
        >
          Accept
        </Button>
      </>
    );
  } else {
    return (
      <>
        <Button
          variant="contained"
          color="primary"
          size="small"
          endIcon={<PersonAddIcon />}
        >
          Add friend
        </Button>
      </>
    );
  }
});

const Profile = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [info, setInfo] = useState(null);
  const [avatarImg, setAvatarImg] = useState(null);
  const [backgroundImg, setBackgroundImg] = useState(null);

  useEffect(() => {
    if (accessToken) {
      fetchInfo(accessToken, accountId, setInfo, navigate);
      setAvatarImg(null);
      setBackgroundImg(null);
    }
  }, [accessToken, accountId, navigate]);

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

          <Grid container>
            <Grid item xs>
              <Typography variant="body1" mb={1}>
                @{info?.username}
              </Typography>
              <Typography variant="body2">
                {info?.friendCount} friends
              </Typography>
            </Grid>

            <Grid item alignSelf={"end"}>
              <BtnFriend
                info={info}
                setAvatarImg={setAvatarImg}
                setBackgroundImg={setBackgroundImg}
              />
            </Grid>
          </Grid>
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

export default memo(Profile);
