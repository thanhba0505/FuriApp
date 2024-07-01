/* eslint-disable react-refresh/only-export-components */
import { Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { memo, useState } from "react";
import ImageUploadDialog from "~/components/ImageUploadDialog";
import Paper from "~/components/Paper";

function Video() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleUpload = async (selectedFile) => {
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      const res = {
        status: 201,
        message: "kkk kkk kkk",
      };

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
      console.error("Lỗi khi upload:", error);
    }
  };

  return (
    <>
      <Paper>
        <Button variant="contained" onClick={() => setOpenDialog(true)}>
          Open Upload Dialog
        </Button>

        <ImageUploadDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onUpload={handleUpload}
        />
      </Paper>
    </>
  );
}

export default memo(Video);
