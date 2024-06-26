import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getFriends,
  getNonFriends,
  getReceivedFriendRequests,
} from "~/api/accountApi";
import { getImageBlob } from "~/api/imageApi";
import Paper from "~/components/Paper";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";
import MessageIcon from "@mui/icons-material/Message";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const Item = ({ item }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const navigate = useNavigate();

  const [img, setImg] = useState();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, item?.avatar);
        if (result.status == 200) {
          setImg(result.url);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (item?.avatar && accessToken) {
      fetchImage();
    }
  }, [item?.avatar, accessToken]);

  return (
    <Grid item xs={4}>
      <Paper mt={0} p="0">
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          p={3}
        >
          <Avatar
            onClick={() => navigate("/profile/" + item?._id)}
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
            {!img ? getFirstLetterUpperCase(item?.username) : ""}
          </Avatar>

          <Typography fontSize={20} fontWeight={500} mt={1}>
            {item && item.fullname}
          </Typography>

          <Typography fontSize={16} mt={0}>
            @{item && item.username}
          </Typography>

          <Box mt={2} width={"100%"} columnGap={1} display={"flex"}>
            <Button
              sx={{ width: "50%" }}
              variant="outlined"
              size="small"
              color="primary"
              endIcon={<CancelIcon />}
            >
              Reject
            </Button>

            <Button
              sx={{ width: "50%" }}
              variant="contained"
              color="primary"
              size="small"
              endIcon={<CheckCircleIcon />}
            >
              Accept
            </Button>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

const Received = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const navigate = useNavigate();

  const [listItems, setListItems] = useState([]);

  const fetchApi = async () => {
    if (accessToken) {
      const res = await getReceivedFriendRequests(accessToken);
      if (res.status == 200) {
        setListItems(res.receivedFriendRequests);
      } else {
        console.log({ res });
      }
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchApi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  return (
    <Box mt={3} height={"calc(100% - 128px)"}>
      <Box
        sx={{
          overflowY: "auto",
          "::-webkit-scrollbar": { display: "none" },
          height: "100%",
        }}
      >
        <Grid container spacing={3}>
          {listItems && listItems.length > 0
            ? listItems.map((item) => (
                <Item key={item._id} item={item} accessToken={accessToken} />
              ))
            : ""}
        </Grid>
      </Box>
    </Box>
  );
};

const ReceivedMemo = React.memo(Received);

export default ReceivedMemo;
