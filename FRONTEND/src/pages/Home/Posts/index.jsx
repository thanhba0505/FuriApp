import React from "react";
import AddPost from "./AddPost";
import PostList from "./PostList";

function Posts() {
  
  return (
    <>
      <AddPost />

      <PostList />
    </>
  );
}

const PostsMemo = React.memo(Posts)

export default PostsMemo;
