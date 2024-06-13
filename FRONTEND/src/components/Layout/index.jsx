import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

function Layout({ children, bg = true }) {
  return (
    <Box
      sx={{
        backgroundColor: "background.paper",
        height: "100vh",
        width: "100vw",
      }}
    >
      <Container
        disableGutters
        maxWidth="xl"
        sx={{
          backgroundColor: bg ? "background.default" : "background.paper",
          height: "100vh",
          borderRadius: (theme) => `${theme.spacing(2)}`,
          overflow: "hidden",
        }}
      >
        {children}
      </Container>
    </Box>
  );
}

export default Layout;
