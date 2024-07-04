import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getPostsByAccountId, getPosts } from "~/api/postApi";
import PostItem from "~/components/PostItem";
import { Box } from "@mui/material";
import InfiniteScrollList from "~/components/InfiniteScrollList";

function PostList({ accessToken, limit, accountId = "" }) {
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

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
      fetchApi();
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
        noMore="No post"
      />
    </Box>
  );
}

const PostListMemo = React.memo(PostList);

export default PostListMemo;
