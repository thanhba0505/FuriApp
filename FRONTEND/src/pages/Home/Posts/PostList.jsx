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
  const limit = 2;

  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);

      const res = await getPosts(accessToken, limit);
        setPosts((prevPosts) => [...prevPosts, ...res.data]);

      setLoading(false);
    };
    loadPosts();
  }, [page, accessToken]);

  const lastPostRef = useCallback(node => {
    if (loading) return; // Nếu đang tải, không làm gì cả
    if (observer.current) observer.current.disconnect(); // Ngắt kết nối observer trước đó nếu có
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1); // Tăng giá trị 'page' khi phần tử cuối cùng hiện ra trong viewport
      }
    });
    if (node) observer.current.observe(node); // Quan sát phần tử cuối cùng
  }, [loading]);

  console.log(posts);

  return (
    <Box>
      {posts.map((post, index) => {
        if (posts.length === index + 1) {
          // Đặt ref vào phần tử cuối cùng
          return (
            <div ref={lastPostRef} key={index}>
              <PostItem post={post} />
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
