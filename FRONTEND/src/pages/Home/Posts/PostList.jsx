import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPosts } from "~/api/postApi";
import PostItem from "./PostItem";
import { Box } from "@mui/material";
import InfiniteScrollList from "~/components/InfiniteScrollList";

function PostList() {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const limit = 6;

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchApi = useCallback(async () => {
    if (accessToken) {
      const res = await getPosts(accessToken, limit);
      if (res.status == 200) {
        setPosts((prev) => [...prev, ...res.posts]);
      } else {
        console.log({ res });
      }

      if (res?.posts?.length < limit) {
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
    <Box>
      <InfiniteScrollList
        items={posts}
        loadMore={fetchApi}
        hasMore={hasMore}
        renderItem={(post, lastItemRef) => (
          <PostItem lastItemRef={lastItemRef} post={post} />
        )}
      />
    </Box>
  );
}

const PostListMemo = React.memo(PostList);

export default PostListMemo;
