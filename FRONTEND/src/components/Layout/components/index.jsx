import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import React from "react";

const Body = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundColor: "custom.backgroundApp",
        height: (theme) => `calc(100vh - ${theme.furi.header.height})`,
        paddingX: (theme) => `${theme.furi.global.paddingX}`,
        paddingBottom: (theme) => `${theme.spacing(1)}`,
      }}
    >
      <Box
        borderTop={1}
        borderColor={"rgba(0,0,0,0.1)"}
        sx={{
          backgroundColor: (theme) => `${theme.palette.background.paper}`,
          height: "100%",
          paddingX: (theme) => `${theme.furi.global.paddingX}`,
          borderRadius: (theme) => `${theme.spacing(1)}`,
          overflow: "hidden",
          boxShadow: "inset 0px 2px 4px -1px rgba(0,0,0,0.1)",
        }}
      >
        <Grid
          container
          columnSpacing={3}
          sx={{
            height: "100%",
          }}
        >
          {children}
        </Grid>
      </Box>
    </Box>
  );
};

const BodyMemo = React.memo(Body);

export default BodyMemo;
