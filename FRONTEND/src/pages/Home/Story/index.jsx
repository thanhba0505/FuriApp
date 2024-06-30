/* eslint-disable react/display-name */
import Grid from "@mui/material/Grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ReplayIcon from "@mui/icons-material/Replay";
import LoadingButton from "@mui/lab/LoadingButton";

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
  Skeleton,
  Typography,
} from "@mui/material";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getImageBlob } from "~/api/imageApi";
import { addStory, getStories } from "~/api/storyApi";
import { useSnackbar } from "notistack";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";

const StoryItem = React.memo(({ imgStory, fullname, avatar }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
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
            backgroundSize: "cover",
            backgroundPosition: "center",

            "&::before": isLoading
              ? ""
              : {
                  content: "''",
                  position: "absolute",
                  height: "70px",
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
              <Typography variant="body1" fontSize={14} color="white" mb={1}>
                {fullname}
              </Typography>

              <Box
                sx={{
                  border: "4px solid",
                  borderColor: "primary.light",
                  borderRadius: 2,
                  position: "absolute",
                  top: 4,
                  left: 4,
                }}
              >
                <Avatar
                  sx={{ width: "30px", height: "30px" }}
                  src={imgAvatar ? imgAvatar : ""}
                  variant="rounded"
                >
                  {!imgAvatar && getFirstLetterUpperCase(fullname)}
                </Avatar>
              </Box>
            </>
          )}
          {isLoading && <CircularProgress color="primary" />}
        </Box>
      </Box>
    </Grid>
  );
});

const Story = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const avatar = account?.avatar;
  const fullname = account?.fullname;
  const { enqueueSnackbar } = useSnackbar();

  const [img, setImg] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);

      const filePreviews = URL.createObjectURL(file);
      setPreviewImage(filePreviews);
    }
  };

  const handlePostSubmit = async () => {
    const formData = new FormData();

    if (!selectedFile) {
      enqueueSnackbar("There is no selected file", {
        variant: "error",
      });
      return;
    }

    formData.append("image", selectedFile);

    try {
      const res = await addStory(accessToken, formData);

      if (res.status == 201) {
        enqueueSnackbar(res.message, {
          variant: "success",
        });
        setSelectedFile(null);
        setPreviewImage(null);
        setOpen(false);
      } else {
        enqueueSnackbar(res.message, {
          variant: "error",
        });
        console.log({ res });
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const limit = 4;

  const [stories, setStories] = useState([]);

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

  const handleReload = () => {
    if (accessToken) {
      fetchApi();
    }
  };

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
              onClick={() => setOpen(true)}
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
            stories?.map((story) => (
              <StoryItem
                key={story?._id}
                fullname={story?.account?.fullname}
                avatar={story?.account?.avatar}
                imgStory={story?.image}
              />
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

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth={"sm"}
      >
        <DialogTitle>
          Add story
          <Typography mt={1}>A memorable photo of you today?</Typography>
        </DialogTitle>

        <DialogContent
          sx={{
            pb: 1,
            pr: 1,
            mr: 2,
            "::-webkit-scrollbar": {
              width: "4px",
              height: "6px",
              backgroundColor: "action.hover",
            },
            "::-webkit-scrollbar-thumb": {
              backgroundColor: "action.hover",
            },
          }}
        >
          {previewImage && (
            <Box>
              <img
                src={previewImage}
                alt="Preview"
                style={{ width: "100%", height: "auto", borderRadius: 8 }}
              />
            </Box>
          )}

          <Button
            sx={{
              width: "100%",
              height: 60,
              borderStyle: "dashed",
              mt: selectedFile ? 2 : 0,
            }}
            variant="outlined"
            component="label"
          >
            Selected file
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleClear} variant="outlined">
            Clear image
          </Button>
          <Button onClick={handlePostSubmit} type="submit" variant="contained">
            Post the story
          </Button>
        </DialogActions>
      </Dialog>

      <Box textAlign={"center"} mt={2}>
        <LoadingButton
          loading={isLoading}
          variant="outlined"
          size="small"
          endIcon={<ReplayIcon />}
          onClick={handleReload}
          color="primary"
        >
          Reload
        </LoadingButton>
      </Box>
    </Paper>
  );
};

const StoryMemo = React.memo(Story);

export default StoryMemo;
