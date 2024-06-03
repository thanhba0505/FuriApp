import Paper from "~/components/Paper";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";

function FormPost({ children, fullName, date, interact }) {
  return (
    <Paper>
      <PostHeader fullName={fullName} date={date} />

      {children}

      <PostFooter interact={interact} />
    </Paper>
  );
}

export default FormPost;
