import { Box, Grid, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getReceivedFriendRequests } from "~/api/accountApi";
import Item from "./Item";

const Received = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  const [listItems, setListItems] = useState([]);

  const fetchApi = useCallback(async () => {
    if (accessToken) {
      const res = await getReceivedFriendRequests(accessToken);
      if (res.status == 200) {
        setListItems(res.receivedFriendRequests);
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
          {listItems && listItems.length > 0 ? (
            listItems.map((item) => (
              <Item
                key={item._id}
                avatar={item?.avatar}
                fullname={item?.fullname}
                username={item?.username}
                accId={item?._id}
                type="received"
              />
            ))
          ) : (
            <Grid item xs>
              <Typography textAlign={"center"}>No request received</Typography>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

const ReceivedMemo = React.memo(Received);

export default ReceivedMemo;
