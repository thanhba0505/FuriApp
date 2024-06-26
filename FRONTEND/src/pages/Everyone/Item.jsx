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

const Btn = ({
  children,
  fullWidth = false,
  variant = "contained",
  icon = <PeopleIcon />,
  handleClick,
}) => {
  return (
    <Button
      onClick={handleClick}
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

const RenderButton = ({ type, handleClick1, handleClick2 }) => {
  if (type == "all") {
    return (
      <>
        <Btn
          handleClick={handleClick1}
          icon={<PersonAddIcon />}
          fullWidth
          variant="contained"
        >
          Add friend
        </Btn>
      </>
    );
  } else if (type == "friends") {
    return (
      <>
        <Btn
          handleClick={handleClick1}
          icon={<MessageIcon />}
          variant="outlined"
        >
          Mess
        </Btn>
        <Btn
          handleClick={handleClick2}
          icon={<PeopleIcon />}
          variant="contained"
        >
          Friends
        </Btn>
      </>
    );
  } else if (type == "received") {
    return (
      <>
        <Btn
          handleClick={handleClick1}
          icon={<CancelIcon />}
          variant="outlined"
        >
          Reject
        </Btn>
        <Btn
          handleClick={handleClick2}
          icon={<CheckCircleIcon />}
          variant="contained"
        >
          Accept
        </Btn>
      </>
    );
  } else if (type == "sent") {
    return (
      <>
        <Btn
          handleClick={handleClick1}
          icon={<TaskAltIcon />}
          fullWidth
          variant="outlined"
        >
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
  lastItemRef,
  handleClick1,
  handleClick2,
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
              handleClick1={handleClick1}
              handleClick2={handleClick2}
            />
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default Item;
