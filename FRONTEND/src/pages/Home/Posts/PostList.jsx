import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getPosts } from "~/api/postApi";
import PostItem from "./PostItem";
import { Box, CircularProgress, Typography } from "@mui/material";

function PostList() {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();
  const limit = 6;

  useEffect(() => {
    if (accessToken) {
      const loadPosts = async () => {
        setLoading(true);

        const res = await getPosts(accessToken, page, limit);
        const newPosts = res.data;

        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setLoading(false);

        if (newPosts.length < limit) {
          setHasMore(false);
        }
      };
      if (hasMore) {
        loadPosts();
      }
    }
  }, [page, hasMore, accessToken]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <Box>
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          return (
            <div ref={lastPostRef} key={index}>
              <PostItem post={post} accessToken={accessToken} />
            </div>
          );
        } else {
          return <PostItem key={index} post={post} />;
        }
      })}

      {loading && (
        <Box textAlign={"center"}  mt={2}>
          <CircularProgress />
        </Box>
      )}
      {!hasMore && (
        <Typography textAlign={"center"} mt={2}>
          No more posts
        </Typography>
      )}
    </Box>
  );
}

const PostListMemo = React.memo(PostList);

export default PostListMemo;
