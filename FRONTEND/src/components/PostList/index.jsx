import React, { useCallback, useEffect, useState } from "react";
import { getPostsByAccountId, getPosts } from "~/api/postApi";
import PostItem from "~/components/PostItem";
import { Box, CircularProgress, Typography } from "@mui/material";
import InfiniteScrollList from "~/components/InfiniteScrollList";

function PostList({ accessToken, limit, accountId = "" }) {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchApi = useCallback(async () => {
    if (accessToken) {
      let res;

      if (accountId) {
        res = await getPostsByAccountId(accessToken, limit, accountId);
      } else {
        res = await getPosts(accessToken, limit);
      }

      if (res.status == 200) {
        setPosts((prev) => [...prev, ...res.posts]);
      } else {
        console.log({ res });
      }

      if (res?.posts?.length < limit) {
        setHasMore(false);
      }
    }
  }, [accessToken, accountId, limit]);

  useEffect(() => {
    if (accessToken) {
      const a = async () => {
        setLoading(true);
        await fetchApi();
        setLoading(false);
      };
      a();
    }
  }, [accessToken, fetchApi]);

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
  }, [accountId]);

  return (
    <Box>
      <InfiniteScrollList
        items={posts}
        loadMore={fetchApi}
        hasMore={hasMore}
        renderItem={(post, lastItemRef) => (
          <PostItem lastItemRef={lastItemRef} post={post} />
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
      {posts.length == 0 && loading && (
        <Box textAlign={"center"} width={"100%"} py={2}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}

const PostListMemo = React.memo(PostList);

export default PostListMemo;
