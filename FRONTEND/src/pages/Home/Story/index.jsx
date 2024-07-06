/* eslint-disable react/display-name */
import Grid from "@mui/material/Grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import Paper from "~/components/Paper";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/material";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getImageBlob } from "~/api/imageApi";
import { addStory, getStories } from "~/api/storyApi";
import { useSnackbar } from "notistack";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";
import ImageUploadDialog from "~/components/ImageUploadDialog";
import Slider from "react-slick";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate } from "react-router-dom";

const StoryItem = React.memo(
  ({
    imgStory,
    fullname,
    avatar,
    accountId,
    onClick,
    scale = "1.1",
    backgroundSize = "cover",
    check = false,
    ...rest
  }) => {
    const account = useSelector((state) => state.auth?.login?.currentAccount);
    const accessToken = account?.accessToken;

    const navigate = useNavigate();

    const [img, setImg] = useState("");
    const [imgAvatar, setImgAvatar] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const fetchImage = async () => {
        try {
          setIsLoading(true);
          const result = await getImageBlob(accessToken, imgStory);

          if (result.status == 200) {
            setImg(result.url);
          }

          setIsLoading(false);
        } catch (error) {
          console.log({ error });
        }
      };

      if (imgStory && accessToken) {
        fetchImage();
      }
    }, [imgStory, accessToken]);

    useEffect(() => {
      const fetchImage = async () => {
        try {
          const result = await getImageBlob(accessToken, avatar);
          if (result.status == 200) {
            setImgAvatar(result.url);
          }
        } catch (error) {
          console.log({ error });
        }
      };

      if (avatar && accessToken) {
        fetchImage();
      }
    }, [avatar, accessToken]);

    return (
      <Box
        height={"100%"}
        {...rest}
        onClick={onClick}
        borderRadius={3}
        position="relative"
        overflow="hidden"
        p={1}
        sx={{
          userSelect: "none",
          cursor: check ? "" : "pointer",
          "& .story-zoom": {
            transition: "ease-out .3s scale",
          },
          "&:hover": {
            "& .story-zoom": {
              scale: scale,
            },
          },
        }}
      >
        {/* Background Image */}
        <Box
          className="story-zoom"
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: isLoading ? "rgba(0, 0, 0, 0.1)" : "",
            backgroundImage: img ? "url(" + img + ")" : null,
            backgroundRepeat: "no-repeat",
            backgroundSize: backgroundSize,
            backgroundPosition: "center",

            boxShadow: "inset 0px 3px 30px 8px rgba(0, 0, 0, 0.1)",

            "&::before": isLoading
              ? ""
              : {
                  content: "''",
                  position: "absolute",
                  height: check ? "90px" : "70px",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0) 100%)`,
                },
          }}
        />

        {/* Content */}
        <Box
          sx={{
            zIndex: 1,
            height: "100%",
            width: "100%",
            position: "relative",
            alignContent: isLoading ? "center" : "end",
            textAlign: "center",
          }}
        >
          {!isLoading && (
            <>
              <Typography
                variant="body1"
                fontSize={check ? 20 : 14}
                color="white"
                mb={check ? 2 : 1}
              >
                {fullname}
              </Typography>

              <Box
                sx={{
                  border: "4px solid",
                  borderColor: "primary.light",
                  borderRadius: 2,
                  position: "absolute",
                  top: check ? 10 : 4,
                  left: check ? 10 : 4,
                }}
              >
                <Avatar
                  sx={{
                    width: check ? "50px" : "30px",
                    height: check ? "50px" : "30px",
                    cursor: "pointer",
                  }}
                  src={imgAvatar ? imgAvatar : ""}
                  variant="rounded"
                  onClick={() => {
                    navigate("/profile/" + accountId);
                  }}
                >
                  {!imgAvatar && getFirstLetterUpperCase(fullname)}
                </Avatar>
              </Box>
            </>
          )}
          {isLoading && <CircularProgress color="primary" />}
        </Box>
      </Box>
    );
  }
);

function SampleNextArrow(props) {
  const { onClick } = props;
  return (
    <Box sx={{ position: "absolute", top: "50%", right: "0", zIndex: 1 }}>
      <IconButton onClick={onClick} color="primary" sx={{ border: 1 }}>
        <KeyboardArrowRightIcon />
      </IconButton>
    </Box>
  );
}

function SamplePrevArrow(props) {
  const { onClick } = props;
  return (
    <Box sx={{ position: "absolute", top: "50%", left: "0", zIndex: 1 }}>
      <IconButton onClick={onClick} color="primary" sx={{ border: 1 }}>
        <KeyboardArrowLeftIcon />
      </IconButton>
    </Box>
  );
}

const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

const Story = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const avatar = account?.avatar;
  const fullname = account?.fullname;
  const { enqueueSnackbar } = useSnackbar();

  const limit = 5;

  const [img, setImg] = useState(null);
  const [openDialogAddStory, setOpenDialogAddStory] = useState(false);
  const [openDialogStory, setOpenDialogStory] = useState(false);
  const [stories, setStories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, avatar);
        if (result.status == 200) {
          setImg(result.url);
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (avatar && accessToken) {
      fetchImage();
    }
  }, [avatar, accessToken]);

  const handleUpload = async (selectedFile) => {
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = await addStory(accessToken, formData);

      if (res.status === 201) {
        enqueueSnackbar(res.message, {
          variant: "success",
        });
      } else {
        enqueueSnackbar(res.message, {
          variant: "error",
        });
      }
    } catch (error) {
      console.error({ error });
    }
  };

  const fetchApi = useCallback(async () => {
    if (accessToken) {
      try {
        setIsLoading(true);
        const res = await getStories(accessToken, limit);

        if (res.status == 200) {
          setStories(res.stories);
        } else {
          console.log({ res });
        }
        setIsLoading(false);
      } catch (error) {
        console.log({ error });
      }
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchApi();
    }
  }, [accessToken, fetchApi]);

  return (
    <Paper>
      <Box>
        <Grid container>
          <Grid item width={"20%"} px={1}>
            <Box
              height={"200px"}
              borderRadius={3}
              position="relative"
              overflow="hidden"
              p={1}
              sx={{
                userSelect: "none",
                cursor: "pointer",
                "& .story-zoom": {
                  transition: "ease-out .3s scale",
                },
                "&:hover": {
                  "& .story-zoom": {
                    scale: "1.1",
                  },
                },
              }}
              onClick={() => setOpenDialogAddStory(true)}
            >
              {/* Background Image */}
              <Box
                className="story-zoom"
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: img ? "secondary.dark" : "",
                  backgroundImage: `url("${img}")`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",

                  "&::before": {
                    content: "''",
                    position: "absolute",
                    height: "50px",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.6) 70%, rgba(0, 0, 0, 0) 100%)`,
                  },
                }}
              />

              {/* Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  textAlign: "center",
                  alignContent: "center",
                }}
              >
                {!img && (
                  <Typography color={"common.white"} fontSize={30} pb={3}>
                    {getFirstLetterUpperCase(fullname)}
                  </Typography>
                )}
              </Box>

              {/* Content */}
              <Box
                sx={{
                  zIndex: 1,
                  height: "100%",
                  width: "100%",
                  position: "relative",
                  alignContent: "end",
                  textAlign: "center",
                }}
              >
                <AddCircleIcon color="warning" fontSize="large" />

                <Typography variant="body1" fontSize={14} color="white" mb={1}>
                  Add story
                </Typography>
              </Box>
            </Box>
          </Grid>

          {isLoading ? (
            <>
              <Grid item width={"20%"} px={1}>
                <Skeleton
                  variant="rounded"
                  width={"100%"}
                  height={"100%"}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
              <Grid item width={"20%"} px={1}>
                <Skeleton
                  variant="rounded"
                  width={"100%"}
                  height={"100%"}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
              <Grid item width={"20%"} px={1}>
                <Skeleton
                  variant="rounded"
                  width={"100%"}
                  height={"100%"}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
              <Grid item width={"20%"} px={1}>
                <Skeleton
                  variant="rounded"
                  width={"100%"}
                  height={"100%"}
                  sx={{ borderRadius: 3 }}
                />
              </Grid>
            </>
          ) : (
            stories &&
            stories?.slice(0, 4).map((story) => (
              <Grid item width={"20%"} px={1} key={story?._id}>
                <StoryItem
                  fullname={story?.account?.fullname}
                  avatar={story?.account?.avatar}
                  accountId={story?.account?._id}
                  imgStory={story?.image}
                  onClick={() => setOpenDialogStory(true)}
                />
              </Grid>
            ))
          )}

          {!isLoading && stories?.length < 4 && (
            <Grid
              item
              width={(4 - stories.length) * 20 + "%"}
              textAlign={"center"}
              alignContent={"center"}
              sx={{ userSelect: "none" }}
            >
              No more
            </Grid>
          )}
        </Grid>
      </Box>

      <ImageUploadDialog
        open={openDialogAddStory}
        onClose={() => setOpenDialogAddStory(false)}
        onUpload={handleUpload}
        title="Upload story"
      />

      <Dialog
        fullWidth
        maxWidth={"sm"}
        open={openDialogStory}
        onClose={() => setOpenDialogStory(false)}
      >
        <DialogTitle>Story</DialogTitle>

        <DialogContent>
          <Box>
            <Slider {...settings}>
              {stories &&
                stories?.map((story) => (
                  <Box
                    key={story?._id}
                    display={"flex !important"}
                    justifyContent={"center"}
                  >
                    <StoryItem
                      fullname={story?.account?.fullname}
                      avatar={story?.account?.avatar}
                      accountId={story?.account?._id}
                      imgStory={story?.image}
                      height="500px"
                      width="400px"
                      backgroundSize="contain"
                      scale="1.04"
                      check
                    />
                  </Box>
                ))}
            </Slider>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={() => setOpenDialogStory(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

const StoryMemo = React.memo(Story);

export default StoryMemo;
