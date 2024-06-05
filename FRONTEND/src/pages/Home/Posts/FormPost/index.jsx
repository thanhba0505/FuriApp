import Paper from "~/components/Paper";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";

function FormPost({ children, fullName, date, interact, comment }) {
  return (
    <Paper>
      <PostHeader fullName={fullName} date={date} />

      {children}

      <PostFooter interact={interact} comment={comment} />
    </Paper>
  );
}

export default FormPost;
