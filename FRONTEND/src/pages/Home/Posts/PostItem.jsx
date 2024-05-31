import FormPost from "~/components/FormPost";

import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Grid from "@mui/material/Grid";
import Paper from "~/components/Paper";
import Stack from "@mui/material/Stack";
import Img from "~/components/Img";
import { Typography } from "@mui/material";

function PostItem({ post }) {
  return (
    <FormPost fullName={post.account.user?.fullName} date={post?.updatedAt}>
      <Typography variant="body1">{post?.content}</Typography>
      <Box height={""}>
        {post.images.map((image, index) => (
          <img
            key={index}
            src={
              import.meta.env.VITE_FURI_API_BASE_URL +
              "/api/image/imagepost/" +
              image
            }
          />
        ))}
      </Box>
    </FormPost>
  );
}

export default PostItem;
