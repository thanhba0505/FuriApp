import Paper from "~/components/Paper";
import PostHeader from "./PostHeader";
import PostFooter from "./PostFooter";

function FormPost({ children, fullName, date }) {
  return (
    <Paper>
      <PostHeader fullName={fullName} date={date} />

      {children}

      <PostFooter />
    </Paper>
  );
}

export default FormPost;
