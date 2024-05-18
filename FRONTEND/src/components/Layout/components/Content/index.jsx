import Grid from "@mui/material/Grid";

function Content({ children, xs = {} }) {
  return (
    <Grid
      sx={{
        overflowY: "auto",
        height: "100%",
        "::-webkit-scrollbar": {
          display: "none",
        },
        pb: "24px",
      }}
      item
      xs={xs}
    >
      {children}
    </Grid>
  );
}

export default Content;
