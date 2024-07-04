import Paper from "~/components/Paper";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import React from "react";

function FormPost({ post, children }) {
  return (
    <Paper>
      <PostHeader
        fullName={post?.account?.fullname}
        date={post?.createdAt}
        avatar={post?.account?.avatar}
        accountId={post?.account?._id}
        postId={post?._id}
      />

      {children}

      <PostFooter post={post} />
    </Paper>
  );
}

const FormPostMemo = React.memo(FormPost);

export default FormPostMemo;
