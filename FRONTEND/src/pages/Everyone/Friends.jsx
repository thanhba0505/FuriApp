import { Box, Grid, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFriends } from "~/api/accountApi";
import Item from "./Item";
import Paper from "~/components/Paper";

const Friends = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [listItems, setListItems] = useState([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  const fetchApi = useCallback(
    async (searchTerm) => {
      if (accessToken) {
        const res = await getFriends(accessToken, searchTerm);
        if (res.status == 200) {
          setListItems(res.friends);
        } else {
          console.log({ res });
        }
      }
    },
    [accessToken]
  );

  useEffect(() => {
    if (accessToken) {
      fetchApi(debouncedValue);
    }
  }, [accessToken, fetchApi, debouncedValue]);

  return (
    <Box mt={3} height={"calc(100% - 208px)"}>
      <Paper>
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          label="Search friend"
          variant="outlined"
          placeholder="Search by fullname or @username"
          size="small"
        />
      </Paper>

      <Box
        sx={{
          mt: 3,
          pb: 3,
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
                avatar={item?.account?.avatar}
                fullname={item?.account?.fullname}
                username={item?.account?.username}
                accId={item?.account?._id}
                conversationId={item?.conversation}
                type="friends"
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

const FriendsMemo = React.memo(Friends);

export default FriendsMemo;
