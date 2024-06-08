import Paper from "~/components/Paper";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";
import React from "react";

function FormPost({ post, children }) {
  return (
    <Paper>
      <PostHeader
        fullName={post.account?.fullname}
        date={post?.updatedAt}
        avatar={post?.account?.avatar}
      />

      {children}

      <PostFooter post={post} />
    </Paper>
  );
}

const FormPostMemo = React.memo(FormPost);

export default FormPostMemo;
