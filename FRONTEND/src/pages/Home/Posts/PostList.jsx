import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getPosts } from "~/api/postApi";
import PostItem from "./PostItem";
import { Box } from "@mui/material";

function PostList() {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const observer = useRef();
  const limit = 6;

  useEffect(() => {
    if (accessToken) {
      const loadPosts = async () => {
        setLoading(true);

        const res = await getPosts(accessToken, limit);
        setPosts((prevPosts) => [...prevPosts, ...res.data]);

        setLoading(false);
      };
      loadPosts();
    }
  }, [page, accessToken]);

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
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

      {loading && <p>Loading...</p>}
    </Box>
  );
}

export default PostList;
