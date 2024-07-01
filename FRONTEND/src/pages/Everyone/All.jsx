import { Box, Grid, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getNonFriends } from "~/api/accountApi";
import InfiniteScrollList from "~/components/InfiniteScrollList";
import Item from "./Item";
import Paper from "~/components/Paper";

const All = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const limit = 15;

  const [value, setValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [listItems, setListItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setCurrentPage(1);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  const fetchApi = useCallback(
    async (page, searchTerm) => {
      if (accessToken) {
        const res = await getNonFriends(accessToken, limit, searchTerm);
        if (res.status == 200) {
          if (page === 1) {
            setListItems(res.nonFriends);
          } else {
            setListItems((prev) => [...prev, ...res.nonFriends]);
          }
        } else {
          console.log({ res });
        }

        if (res.nonFriends.length < limit) {
          setHasMore(false);
        }
      }
    },
    [accessToken]
  );

  useEffect(() => {
    if (accessToken) {
      fetchApi(1, debouncedValue);
    }
  }, [accessToken, fetchApi, debouncedValue]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchApi(nextPage, debouncedValue);
  };

  return (
    <Box mt={3} height={"calc(100% - 208px)"}>
      <Paper>
        <TextField
          value={value}
          onChange={(e) => setValue(e.target.value)}
          fullWidth
          label="Search everyone"
          variant="outlined"
          placeholder="Search by fullname or @username"
          size="small"
        />
      </Paper>

      <Box
        sx={{
          mt: 3,
          overflowY: "auto",
          "::-webkit-scrollbar": { display: "none" },
          height: "100%",
        }}
      >
        <Grid container spacing={3}>
          <InfiniteScrollList
            items={listItems}
            loadMore={loadMore}
            hasMore={hasMore}
            renderItem={(item, lastItemRef) => (
              <Item
                accId={item?._id}
                lastItemRef={lastItemRef}
                avatar={item?.avatar}
                username={item?.username}
                fullname={item?.fullname}
                type="all"
              />
            )}
            noMore="No one"
          />
        </Grid>
      </Box>
    </Box>
  );
};

const AllMemo = React.memo(All);

export default AllMemo;
