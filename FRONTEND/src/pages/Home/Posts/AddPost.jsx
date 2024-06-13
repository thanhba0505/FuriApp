import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import ClearIcon from "@mui/icons-material/Clear";

import Paper from "~/components/Paper";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import { getImageBlob } from "~/api/imageApi";
import { addPost } from "~/api/postApi";
import { Alert, IconButton, Snackbar } from "@mui/material";

const AddPost = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const avatar = account?.avatar;
  const fullname = account?.fullname;

  const [img, setImg] = useState(null);
  const [content, setContent] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [message, setMessage] = useState("");
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/jfif",
    "image/pjpeg",
    "image/pjp",
  ];
  const maxImageSize = 10 * 1024 * 1024; // 10MB

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
    const files = Array.from(event.target.files);
    const newFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!validImageTypes.includes(file.type)) {
        setMessage(`File ${file.name} is not a valid image type`);
        setOpen(true);
        continue;
      }

      if (file.size > maxImageSize) {
        setMessage(`File ${file.name} exceeds the maximum size of 10MB`);
        setOpen(true);
        continue;
      }

      const isDuplicate = selectedFiles.some(
        (selectedFile) =>
          selectedFile.name === file.name && selectedFile.size === file.size
      );

      if (!isDuplicate) {
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      } else {
        console.log("SDFsd");
        setMessage(`File ${file.name} is already selected`);
        setOpen(true);
      }
    }

    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    setPreviewImages((prevImages) => [...prevImages, ...newPreviews]);
  };

  const handleDeleteImage = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPreviewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handlePostSubmit = async () => {
    const formData = new FormData();

    if (content.trim() === "" && selectedFiles.length === 0) {
      setMessage("Content or images must be provided");
      setOpen(true);
      return;
    }

    if (selectedFiles.length > 10) {
      setMessage("The number of photos must be less than 10");
      setOpen(true);
      return;
    }

    formData.append("content", content);

    for (const file of selectedFiles) {
      formData.append("images", file);
    }

    try {
      const res = await addPost(accessToken, formData);

      if (res) {
        setContent("");
        setSelectedFiles([]);
        setPreviewImages([]);
      }

      setMessage("Post the article successfully");
      setOpen(true);
    } catch (error) {
      setMessage("Error posting the article");
      setOpen(true);
    }
  };

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <Paper>
      <Accordion
        sx={{
          backgroundColor: (theme) => theme.palette.background.default,
          boxShadow: "none",
          padding: "0",
          ".MuiButtonBase-root": {
            padding: "0",
          },
          ".MuiAccordionSummary-content": {
            margin: "0 !important",
            alignItems: "center",
            gap: (theme) => theme.spacing(2),
          },
          ".MuiAccordionDetails-root": {
            paddingX: 0,
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          sx={{ minHeight: "48px !important" }}
        >
          {img && (
            <Avatar
              src={img}
              alt={account?.fullname}
              sx={{ width: 40, height: 40 }}
              variant="rounded"
            />
          )}

          <Box>
            <Typography variant="body1" fontWeight={700}>
              {fullname}
            </Typography>
            <Typography variant="body2">How do you feel today?</Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails>
          <TextField
            fullWidth
            id="outlined-textarea"
            label="How do you feel today?"
            placeholder="Please share it!"
            multiline
            minRows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mt: 2 }}
          />

          <Grid container pt="16px" columnSpacing="16px" alignItems={"center"}>
            {previewImages.length > 0 && (
              <Grid item xs={12} mb={2}>
                <Box
                  sx={{
                    userSelect: "none",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
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
                  <Box display="inline-flex" gap="16px" pt={1} mb={1}>
                    {previewImages.map((src, index) => (
                      <Box
                        key={index}
                        position="relative"
                        display="inline-block"
                      >
                        <img
                          src={src}
                          alt={`preview-${index}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "10px",
                          }}
                        />
                        <IconButton
                          aria-label="delete"
                          onClick={() => handleDeleteImage(index)}
                          sx={{
                            position: "absolute",
                            backgroundColor: "info.light",
                            color: "white",
                            border: "4px solid",
                            borderColor: (theme) => `${theme.lableSelect}`,
                            top: "-8px",
                            right: "-8px",
                            width: "30px",
                            height: "30px",

                            "&:hover": {
                              backgroundColor: "info.main",
                            },
                          }}
                        >
                          <ClearIcon fontSize="small" color="white" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            )}

            <Grid item xs>
              {previewImages.length > 0
                ? `You have chosen ${previewImages.length} photos`
                : "Add to your post:"}
            </Grid>

            <Grid
              item
              xs="auto"
              container
              alignItems={"center"}
              alignSelf={"stretch"}
            >
              <Button
                color="secondary"
                component="label"
                sx={{ height: "100%", px: "16px !important", ml: "8px" }}
                variant="outlined"
                startIcon={<AddPhotoIcon />}
              >
                Image
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleFileChange}
                />
              </Button>

              <Button
                color="secondary"
                sx={{
                  height: "100%",
                  px: "16px !important",
                  py: "8px !important",
                  ml: "16px",
                }}
                variant="contained"
                startIcon={<PostAddIcon />}
                onClick={handlePostSubmit}
              >
                Post article
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      <span>
        <Snackbar
          open={open}
          autoHideDuration={3000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          sx={{
            bottom: "30px!important",
            right: "30px!important",
            maxHeight: "30vw",
          }}
        >
          <Alert
            onClose={handleClose}
            severity={
              message == "Post the article successfully" ? "info" : "error"
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

const AddPostMemo = React.memo(AddPost);

export default AddPostMemo;
