import { Box, Grid } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getNonFriends } from "~/api/accountApi";
import InfiniteScrollList from "~/components/InfiniteScrollList";
import Item from "./Item";

const All = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const limit = 15;

  const [listItems, setListItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchApi = useCallback(async () => {
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
          <InfiniteScrollList
            items={listItems}
            loadMore={fetchApi}
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
          />
        </Grid>
      </Box>
    </Box>
  );
};

const AllMemo = React.memo(All);

export default AllMemo;
