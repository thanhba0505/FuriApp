import { useState } from "react";
import Button from "@mui/material/Button";
import PostAddIcon from "@mui/icons-material/PostAdd";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AddPhotoIcon from "@mui/icons-material/AddPhotoAlternate";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Grid from "@mui/material/Grid";
import Paper from "~/components/Paper";

import Avatar from "~/components/Avatar";
import { Box } from "@mui/material";

function AddPost() {
  const [age, setAge] = useState(10);

  const handleChange = (event) => {
    setAge(event.target.value);
  };
  return (
    <Paper>
      <Accordion
        // slotProps={{ transition: { unmountOnExit: true } }}
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
        {/* title */}
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Avatar v={"rounded"} />
          <Box>
            <Typography variant="body1" fontWeight={700}>
              Furina!
            </Typography>
            <Typography variant="body2">How do you feel today?</Typography>
          </Box>
        </AccordionSummary>

        {/* form select can see */}
        <FormControl sx={{ width: "100%", mt: "12px", mb: "8px" }} size="small">
          <InputLabel
            id="demo-select-small-label"
            sx={{
              backgroundColor: (theme) => theme.lableSelect,
              pr: "4px",
            }}
          >
            Who can see?
          </InputLabel>
          <Select
            labelId="demo-select-small-label"
            id="demo-select-small"
            value={age}
            label="Age"
            onChange={handleChange}
          >
            <MenuItem value={10}>Public</MenuItem>
            <MenuItem value={20}>My friends</MenuItem>
            <MenuItem value={30}>Only me</MenuItem>
          </Select>
        </FormControl>

        {/* content */}
        <AccordionDetails>
          <TextField
            fullWidth
            id="outlined-textarea"
            label="How do you feel today?"
            placeholder="Please share it!"
            multiline
            minRows={4}
          />

          <Grid container pt="16px" columnSpacing="16px" alignItems={"center"}>
            <Grid item xs>
              Add to your post:
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
                sx={{ height: "100%", px: "16px !important", ml: "8px" }}
                variant="outlined"
                startIcon={<AddPhotoIcon />}
              >
                Image
              </Button>
              <Button
                color="secondary"
                sx={{ height: "100%", px: "16px !important", ml: "8px" }}
                variant="outlined"
                startIcon={<VideoCallIcon />}
              >
                Video
              </Button>
              <Button
                color="secondary"
                sx={{ height: "100%", px: "16px !important", ml: "8px" }}
                variant="outlined"
                startIcon={<PersonAddIcon />}
              >
                Friends
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
              >
                Post article
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}

export default AddPost;
