import {
  Box,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
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
  const [loading, setLoading] = useState(false);

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
        if (page === 1) {
          setLoading(true);
        }
        const res = await getNonFriends(accessToken, limit, searchTerm);

        if (page === 1) {
          setLoading(false);
        }

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
        } else {
          setHasMore(true);
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

  const loadMore = useCallback(async () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await fetchApi(nextPage, debouncedValue);
  }, [currentPage, debouncedValue, fetchApi]);

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
          {loading ? (
            <Grid item xs={12} textAlign={"center"} mt={2}>
              <CircularProgress />
            </Grid>
          ) : (
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
              NoMoreComponent={() => (
                <Typography textAlign={"center"} width={"100%"} py={2} pl={3}>
                  No one left
                </Typography>
              )}
              LoadingComponent={() => (
                <Box textAlign={"center"} width={"100%"} pl={3} py={2}>
                  <CircularProgress />
                </Box>
              )}
            />
          )}
        </Grid>
      </Box>
    </Box>
  );
};

const AllMemo = React.memo(All);

export default AllMemo;
