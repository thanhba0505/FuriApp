import Slider from "react-slick";
import Grid from "@mui/material/Grid";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import Paper from "~/components/Paper";
import {
  Alert,
  Box,
  Button,
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

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getImageBlob } from "~/api/imageApi";

const SampleNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "red" }}
      onClick={onClick}
    />
  );
};

const SamplePrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "green" }}
      onClick={onClick}
    />
  );
};

const settings = {
  infinite: false,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  // lazyLoad: true,
  draggable: false,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};

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
    setSelectedFile(file);

    const filePreviews = URL.createObjectURL(file);
    setPreviewImage(filePreviews);
  };

  const handlePostSubmit = async () => {
    const formData = new FormData();

    if (!selectedFile) {
      setMessage("There is no selected file");
      setOpenNotify(true);
      return;
    }

    formData.append("image", selectedFile);

    // try {
    //   const res = await addPost(accessToken, formData);

    //   if (res) {
    //     setSelectedFile(null);
    //     setPreviewImage(null);
    //   }

    //   setMessage("Post the story successfully");
    //   setOpen(true);
    // } catch (error) {
    //   setMessage("Error posting the story");
    //   setOpen(true);
    //   console.log({ error });
    // }
  };

  return (
    <Paper>
      <Box>
        <Slider {...settings}>
          <Box px={1}>
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

                <Typography variant="body1" fontSize={16} color="white" mb={1}>
                  Add story
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box px={1}>
            <Box height={"200px"} bgcolor={"bisque"}></Box>
          </Box>
          <Box px={1}>
            <Box height={"200px"} bgcolor={"bisque"}></Box>
          </Box>
          <Box px={1}>
            <Box height={"200px"} bgcolor={"bisque"}></Box>
          </Box>
          <Box px={1}>
            <Box height={"200px"} bgcolor={"bisque"}></Box>
          </Box>
        </Slider>
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
              message == "Post the story successfully" ? "success" : "error"
            }
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </span>
    </Paper>
  );
};

const StoryMemo = React.memo(Story);

export default Story;
