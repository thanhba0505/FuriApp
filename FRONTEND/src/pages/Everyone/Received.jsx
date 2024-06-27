import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getReceivedFriendRequests } from "~/api/accountApi";
import Item from "./Item";

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
                <Item
                  key={item._id}
                  avatar={item?.avatar}
                  fullname={item?.fullname}
                  username={item?.username}
                  accId={item?._id}
                  type="received"
                />
              ))
            : ""}
        </Grid>
      </Box>
    </Box>
  );
};

const ReceivedMemo = React.memo(Received);

export default ReceivedMemo;
