import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getNonFriends } from "~/api/accountApi";
import { getImageBlob } from "~/api/imageApi";
import InfiniteScrollList from "~/components/InfiniteScrollList";
import Paper from "~/components/Paper";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";
import PersonAddAltTwoToneIcon from "@mui/icons-material/PersonAddAltTwoTone";

const Item = ({ item, lastItemRef }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const navigate = useNavigate();

  const [img, setImg] = useState();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, item.avatar);
        if (result.status == 200) {
          setImg(result.url);
        }
      } catch (error) {
        console.log({ error });
      }
    };
    if (item.avatar && accessToken) {
      fetchImage();
    }
  }, [item.avatar, accessToken]);

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

          <Box mt={2} width={"100%"}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              endIcon={<PersonAddAltTwoToneIcon />}
            >
              Send request
            </Button>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

const All = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const limit = 15;
  const navigate = useNavigate();

  const [listItems, setListItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchApi = async () => {
    if (accessToken) {
      const res = await getNonFriends(accessToken, limit);
      if (res.status == 200) {
        setListItems((prev) => [...prev, ...res.nonFriends]);
      } else {
        console.log({ res });
      }

      if (res.nonFriends.length < limit) {
        setHasMore(false);
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
          <InfiniteScrollList
            items={listItems}
            loadMore={fetchApi}
            hasMore={hasMore}
            renderItem={(item, lastItemRef) => (
              <Item
                item={item}
                accessToken={accessToken}
                lastItemRef={lastItemRef}
              />
            )}
          />
        </Grid>
      </Box>
    </Box>
  );
};

const AllMemo = React.memo(All);

export default AllMemo;
