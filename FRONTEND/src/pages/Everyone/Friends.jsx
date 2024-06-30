import { Box, Grid } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFriends } from "~/api/accountApi";
import Item from "./Item";

const Friends = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  const [listItems, setListItems] = useState([]);

  const fetchApi = useCallback(async () => {
    if (accessToken) {
      const res = await getFriends(accessToken);
      if (res.status == 200) {
        setListItems(res.friends);
      } else {
        console.log({ res });
      }
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchApi();
    }
  }, [accessToken, fetchApi]);

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
                <Item
                  key={item._id}
                  avatar={item?.account?.avatar}
                  fullname={item?.account?.fullname}
                  username={item?.account?.username}
                  accId={item?.account?._id}
                  conversationId={item?.conversation}
                  type="friends"
                />
              ))
            : ""}
        </Grid>
      </Box>
    </Box>
  );
};

const FriendsMemo = React.memo(Friends);

export default FriendsMemo;
