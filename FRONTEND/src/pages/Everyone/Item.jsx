import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getImageBlob } from "~/api/imageApi";
import Paper from "~/components/Paper";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";
import MessageIcon from "@mui/icons-material/Message";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { sendFriendRequest } from "~/api/accountApi";
import { io } from "socket.io-client";

const Btn = ({
  children,
  fullWidth = false,
  variant = "contained",
  icon = <PeopleIcon />,
  onClick,
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        width: () => (fullWidth ? "100%" : "50%"),
      }}
      variant={variant}
      size="small"
      color="primary"
      endIcon={icon}
    >
      {children}
    </Button>
  );
};

const RenderButton = ({ type, accId, conversationId }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const navigate = useNavigate();
  const accountId = account?._id;

  const [typeBtn, setTypeBtn] = useState(type);

  useEffect(() => {
    if (accessToken) {
      const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

      const senderId = accountId;
      const receiverId = accId;

      socket.on(
        "emitEveryoneRequest" + senderId + receiverId,
        ({ type, receiver }) => {
          console.log({ emit: { type, receiver } });

          switch (type) {
            case "sent":
              setTypeBtn("sent");
              break;

            default:
              break;
          }
        }
      );

      socket.on(
        "emitEveryoneRequest" + receiverId + senderId,
        ({ type, receiver }) => {
          console.log({ emit: { type, receiver } });

          switch (type) {
            case "sent":
              setTypeBtn("received");
              break;

            default:
              break;
          }
        }
      );

      return () => {
        socket.disconnect();
      };
    }
  }, [accountId, accessToken, accId]);

  const handleClickAll = () => {
    const loadRequest = async () => {
      const res = await sendFriendRequest(accessToken, accId);
      if (res.status == 200) {
        console.log(res);
      } else {
        console.log(res);
      }
    };

    if (accessToken && accId && typeBtn == "all") {
      loadRequest();
    }
  };

  if (typeBtn == "all") {
    return (
      <>
        <Btn
          icon={<PersonAddIcon />}
          fullWidth
          variant="contained"
          onClick={handleClickAll}
        >
          Add friend
        </Btn>
      </>
    );
  } else if (typeBtn == "friends") {
    return (
      <>
        <Btn
          icon={<MessageIcon />}
          variant="outlined"
          onClick={() => navigate("/message/" + conversationId)}
        >
          Mess
        </Btn>
        <Btn icon={<PeopleIcon />} variant="contained">
          Friends
        </Btn>
      </>
    );
  } else if (typeBtn == "received") {
    return (
      <>
        <Btn icon={<CancelIcon />} variant="outlined">
          Reject
        </Btn>
        <Btn icon={<CheckCircleIcon />} variant="contained">
          Accept
        </Btn>
      </>
    );
  } else if (typeBtn == "sent") {
    return (
      <>
        <Btn icon={<TaskAltIcon />} fullWidth variant="outlined">
          Sent request
        </Btn>
      </>
    );
  }
};

const Item = ({
  accId,
  avatar,
  username = "",
  fullname = "",
  type = "all",
  conversationId,
  lastItemRef,
}) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const navigate = useNavigate();

  const [img, setImg] = useState();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, avatar);
        if (result.status == 200) {
          setImg(result.url);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (avatar && accessToken) {
      fetchImage();
    }
  }, [avatar, accessToken]);

  return (
    <Grid item xs={4} ref={lastItemRef ? lastItemRef : null}>
      <Paper mt={0} p="0">
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          p={3}
        >
          <Avatar
            onClick={() => navigate("/profile/" + accId)}
            src={img ? img : ""}
            sx={{
              height: 120,
              width: 120,
              fontSize: 40,
              cursor: "pointer",
              transition: "scale .3s linear",
              "& .MuiAvatar-img": {
                transition: "scale .3s ease-out",
              },
              "&:hover": {
                scale: "1.1",
                "& .MuiAvatar-img": {
                  scale: "1.15",
                },
              },
            }}
          >
            {!img ? getFirstLetterUpperCase(username) : ""}
          </Avatar>

          <Typography fontSize={20} fontWeight={500} mt={1}>
            {accId && fullname}
          </Typography>

          <Typography fontSize={16} mt={0}>
            @{accId && username}
          </Typography>

          <Box mt={2} width={"100%"} columnGap={1} display={"flex"}>
            <RenderButton
              type={type}
              accId={accId}
              conversationId={conversationId}
            />
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default Item;
