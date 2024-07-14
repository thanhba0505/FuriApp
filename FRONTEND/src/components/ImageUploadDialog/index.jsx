/* eslint-disable react-refresh/only-export-components */
import { memo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";

const ImageUploadDialog = ({
  open,
  onClose,
  onUpload,
  title = "Upload image",
  titleBtnUpload = "Upload",
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const filePreviews = URL.createObjectURL(file);
      setPreviewImage(filePreviews);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewImage(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      enqueueSnackbar("There is no selected file", {
        variant: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      setPreviewImage(null);
      onClose();
    } catch (error) {
      console.error({ error });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
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
        {previewImage ? (
          <Box>
            <img
              src={previewImage}
              alt="Preview"
              style={{ width: "100%", height: "auto", borderRadius: 8 }}
            />
          </Box>
        ) : (
          <Typography textAlign={"center"} my={3}>
            No images uploaded yet
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          sx={{
            borderStyle: "dashed",
          }}
          variant="outlined"
          component="label"
        >
          Select file
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        <Button onClick={handleClear} variant="outlined">
          Clear image
        </Button>

        {/* <Button
          onClick={handleUpload}
          type="submit"
          variant="contained"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} /> : titleBtnUpload}
        </Button> */}

        <LoadingButton
          onClick={handleUpload}
          variant="contained"
          loading={isLoading}
        >
          {titleBtnUpload}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default memo(ImageUploadDialog);
