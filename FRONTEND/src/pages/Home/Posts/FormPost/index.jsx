import Paper from "~/components/Paper";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";

function FormPost({ post, children }) {
  return (
    <Paper>
      <PostHeader
        fullName={post.account?.user?.fullName}
        date={post?.updatedAt}
      />

      {children}

      <PostFooter post={post} />
    </Paper>
  );
}

export default FormPost;
