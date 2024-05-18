import Slider from "react-slick";
import Grid from "@mui/material/Grid";

import Paper from "~/components/Paper";
import { Box } from "@mui/material";

import AddStory from "./StoryItem";

function Stories() {
  var settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    lazyLoad: true,
    draggable: false,
    // nextArrow: <></>,
    // prevArrow: <></>,
  };
  return (
    <Paper>
      <Grid
        container
        columnSpacing="10px"
        sx={{
          ">.MuiGrid-grid-xs-3": { maxWidth: "20%" },
          ">.MuiGrid-grid-xs-9": {
            maxWidth: "80%",
            flex: "1",
          },
          ".slick-track": {
            position: "relative",
            left: "10px",
          },
          ".slick-list": {
            borderRadius: "8px",
            overflow: "hidden",
          },
        }}
      >
        <Grid item xs={3}>
          <AddStory t={`calc(100% - 90px)`} l={`calc(50% - 24px) `} />
        </Grid>

        <Grid item xs={9}>
          <Box sx={{}}>
            <Slider {...settings}>
              <Grid
                container
                sx={{ display: "flex!important" }}
                columnSpacing="10px"
              >
                <Grid item xs={3}>
                  <AddStory
                    avatar="/public/images/app/logo-furi.png"
                    image="/public/images/app/stories.jpg"
                    name="Furina"
                  />
                </Grid>
                <Grid item xs={3}>
                  <AddStory
                    avatar="/public/images/app/logo-furi.png"
                    image="/public/images/app/stories.jpg"
                    name="Furina"
                  />
                </Grid>
                <Grid item xs={3}>
                  <AddStory
                    avatar="/public/images/app/logo-furi.png"
                    image="/public/images/app/stories.jpg"
                    name="Furina"
                  />
                </Grid>
                <Grid item xs={3}>
                  <AddStory
                    avatar="/public/images/app/logo-furi.png"
                    image="/public/images/app/stories.jpg"
                    name="Furina"
                  />
                </Grid>
              </Grid>
              <Grid
                container
                sx={{ display: "flex!important" }}
                columnSpacing="10px"
              >
                <Grid item xs={3}>
                  <AddStory
                    avatar="/public/images/app/logo-furi.png"
                    image="/public/images/app/stories.jpg"
                    name="Furina"
                  />
                </Grid>
                <Grid item xs={3}>
                  <AddStory
                    avatar="/public/images/app/logo-furi.png"
                    image="/public/images/app/stories.jpg"
                    name="Furina"
                  />
                </Grid>
                <Grid item xs={3}>
                  <AddStory
                    avatar="/public/images/app/logo-furi.png"
                    image="/public/images/app/stories.jpg"
                    name="Furina"
                  />
                </Grid>
                <Grid item xs={3}>
                  <AddStory
                    avatar="/public/images/app/logo-furi.png"
                    image="/public/images/app/stories.jpg"
                    name="Furina"
                  />
                </Grid>
              </Grid>
            </Slider>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Stories;
