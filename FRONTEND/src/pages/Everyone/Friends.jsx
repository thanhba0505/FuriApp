import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFriends } from "~/api/accountApi";
import Item from "./Item";

const Friends = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const navigate = useNavigate();

  const [listItems, setListItems] = useState([]);

  const fetchApi = async () => {
    if (accessToken) {
      const res = await getFriends(accessToken);
      if (res.status == 200) {
        setListItems(res.friends);
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

  const handleClick1 = () => {
    console.log("1");
  };

  const handleClick2 = () => {
    console.log("2");
  };

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
                  handleClick1={handleClick1}
                  handleClick2={handleClick2}
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
