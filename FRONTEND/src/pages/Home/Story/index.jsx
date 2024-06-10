/* eslint-disable react/display-name */
import Slider from "react-slick";
import Grid from "@mui/material/Grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import Paper from "~/components/Paper";
import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getImageBlob } from "~/api/imageApi";
import { addStory, getStories } from "~/api/storyApi";

const StoryItem = React.memo(({ src, fullname, avatar }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const [img, setImg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setIsLoading(true);
        const result = await getImageBlob(accessToken, src);
        setImg(result);
        setIsLoading(false);
      } catch (error) {
        console.log({ error });
      }
    };

    if (src && accessToken) {
      fetchImage();
    }
  }, [src, accessToken]);

  return (
    <Grid item width={"20%"} px={1}>
      <Box
        height={"200px"}
        borderRadius={3}
        position="relative"
        overflow="hidden"
        p={1}
        sx={{
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
            backgroundImage: `url("${img}")`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",

            "&::before": {
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

              <Avatar
                sx={{
                  height: 30,
                  width: 30,
                  position: "absolute",
                  top: 4,
                  left: 4,
                }}
                variant="rounded"
              />
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

  const [img, setImg] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [message, setMessage] = useState("");
  const [openNotify, setOpenNotify] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCloseNotify = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenNotify(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, avatar);
        setImg(result);
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
      setMessage("There is no selected file");
      setOpenNotify(true);
      return;
    }

    formData.append("image", selectedFile);

    try {
      const res = await addStory(accessToken, formData);

      if (res) {
        setSelectedFile(null);
        setPreviewImage(null);
      }

      setMessage("Post the story successfully");
      setOpenNotify(true);
    } catch (error) {
      setMessage("Error posting the story");
      setOpenNotify(true);
    }
  };

  const limit = 4;

  const [stories, setStories] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadPosts = async () => {
      setIsLoading(true);
      const res = await getStories(accessToken, page, limit);
      setStories(res.data);
      setIsLoading(false);
    };

    if (page && accessToken) {
      loadPosts();
    }
  }, [page, accessToken]);

  console.log(stories);

  const handleNext = () => {
    if (stories.length == 4) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
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
              onClick={handleClickOpen}
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
                }}
              />

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
                <AddCircleIcon color="primary" fontSize="large" />

                <Typography variant="body1" fontSize={14} color="white" mb={1}>
                  Add story
                </Typography>
              </Box>
            </Box>
          </Grid>

          {!isLoading &&
            stories?.map((story, index) => (
              <StoryItem
                key={index}
                fullname={story.account.fullname}
                avatar={story.account.avatar}
                src={story.image}
              />
            ))}
        </Grid>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={"sm"}>
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
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClear} variant="outlined">
            Clear image
          </Button>
          <Button onClick={handlePostSubmit} type="submit" variant="contained">
            Post the story
          </Button>
        </DialogActions>
      </Dialog>

      <span>
        <Snackbar
          open={openNotify}
          autoHideDuration={3000}
          onClose={handleCloseNotify}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            bottom: "30px!important",
            right: "30px!important",
            maxHeight: "30vw",
          }}
        >
          <Alert
            onClose={handleCloseNotify}
            severity={
              message == "Post the story successfully" ? "info" : "error"
            }
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </span>

      <Button onClick={handlePrevious}>previous</Button>
      <Button onClick={handleNext}>next</Button>
    </Paper>
  );
};

const StoryMemo = React.memo(Story);

export default Story;
