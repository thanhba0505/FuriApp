import React from "react";
import AddPost from "./AddPost";
import PostList from "~/components/PostList";
import { useSelector } from "react-redux";

function Posts() {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const limit = 6;

  return (
    <>
      <AddPost />

      <PostList accessToken={accessToken} limit={limit} />
    </>
  );
}

const PostsMemo = React.memo(Posts);

export default PostsMemo;
