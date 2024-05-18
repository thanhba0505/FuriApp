import AddBoxIcon from "@mui/icons-material/AddBox";

import Paper from "~/components/Paper";
import ButtonIconCustom from "~/components/Button/ButtonIconCustom";
import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";

function StoryItem({
  avatar = "",
  image = "/public/images/app/stories.jpg",
  name = "Add Story",
  t = "10px",
  l = "10px",
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Box onClick={handleOpen}>
        <Paper mt={false} p="0" h="200px" bs={false}>
          <img
            src={image}
            alt="stories"
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }}
          />

          {/* title */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              textAlign: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "common.white",
                fontWeight: 600,
                userSelect: "none",
                paddingTop: "4px",
                paddingBottom: "14px",
              }}
            >
              {name}
            </Typography>
          </Box>

          {/* avatar */}
          <Box
            sx={{
              position: "absolute",
              top: t,
              left: l,
            }}
          >
            <ButtonIconCustom src={avatar}>
              <AddBoxIcon />
            </ButtonIconCustom>
          </Box>
        </Paper>
      </Box>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>Add Stories</Box>
      </Modal>
    </>
  );
}

export default StoryItem;
