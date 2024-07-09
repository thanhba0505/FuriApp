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
import { IconButton } from "@mui/material";
import { useSnackbar } from "notistack";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";

const AddPost = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const avatar = account?.avatar;
  const fullname = account?.fullname;
  const maxImageSize = 10 * 1024 * 1024; // 10MB
  const validImageTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/jfif",
    "image/pjpeg",
    "image/pjp",
  ];
  const { enqueueSnackbar } = useSnackbar();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [content, setContent] = useState("");

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = [];
    const newPreviews = [];

    for (const file of files) {
      if (!validImageTypes.includes(file.type)) {
        enqueueSnackbar("File ${file.name} is not a valid image type", {
          variant: "error",
        });
        continue;
      }

      if (file.size > maxImageSize) {
        enqueueSnackbar("File ${file.name} exceeds the maximum size of 10MB", {
          variant: "error",
        });
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
        enqueueSnackbar("File ${file.name} is already selected", {
          variant: "error",
        });
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
      enqueueSnackbar("Content or images must be provided", {
        variant: "error",
      });
      return;
    }

    if (selectedFiles.length > 10) {
      enqueueSnackbar("The number of photos must be less than 10", {
        variant: "error",
      });
      return;
    }

    formData.append("content", content);

    for (const file of selectedFiles) {
      formData.append("images", file);
    }

    try {
      const res = await addPost(accessToken, formData);

      if (res.status === 201) {
        setContent("");
        setSelectedFiles([]);
        setPreviewImages([]);
      }

      enqueueSnackbar("Post the article successfully", {
        variant: "success",
      });
    } catch (error) {
      console.log({ error });
    }
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
          <Avatar
            src={avatar ? avatar : ""}
            alt={account?.fullname}
            sx={{ width: 40, height: 40 }}
            variant="rounded"
          >
            {!avatar && getFirstLetterUpperCase(account?.fullname)}
          </Avatar>

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
                color="primary"
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
                color="primary"
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
    </Paper>
  );
};

const AddPostMemo = React.memo(AddPost);

export default AddPostMemo;
