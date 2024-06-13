/* eslint-disable react/display-name */
import React from "react";
import Sidebar from "../components/SidebarRight";
import Paper from "~/components/Paper";
import { useSelector } from "react-redux";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Typography } from "@mui/material";

const PaperFirst = React.memo(() => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  

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
            alignItems: "start",
            gap: (theme) => theme.spacing(2),
          },
          ".MuiAccordionDetails-root": {
            paddingX: 0,
          },
        }}
        defaultExpanded
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          sx={{ minHeight: "30px !important" }}
        >
          <Typography variant="body1" fontSize={20} fontWeight={700}>
            My friends
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>

        </AccordionDetails>
      </Accordion>
    </Paper>
  );
});

const PaperSecond = React.memo(() => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  return <Paper>PaperFirst</Paper>;
});

const PaperThird = React.memo(() => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  return <Paper>PaperFirst</Paper>;
});

function SidebarRight({ xs = {} }) {
  return (
    <Sidebar xs={xs}>
      <PaperFirst />
      <PaperSecond />
      <PaperThird />
    </Sidebar>
  );
}

export default SidebarRight;
