import FormPost from "~/components/FormPost";

import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Grid from "@mui/material/Grid";
import Paper from "~/components/Paper";
import Stack from "@mui/material/Stack";
import Img from "~/components/Img";

function CustomImg({ src, alt }) {
  return <Img src={src} alt={alt} br={8} maxh={"70vh"} />;
}

function PostItem({ ...post }) {
  return (
    <FormPost>
      <Box my={2} maxHeight={"70vh"} height={""}>
        <Grid container justifyContent={"center"} columnSpacing={"20px"}>
          <Grid item xs={12}>
            <CustomImg
              src={"https://images.unsplash.com/photo-1549388604-817d15aa0110"}
              alt={"Bed"}
            />
          </Grid>
        </Grid>
      </Box>
    </FormPost>
  );
}

export default PostItem;
