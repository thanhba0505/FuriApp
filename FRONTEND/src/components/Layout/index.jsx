import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Layout({ children, bg = true }) {
  const account = useSelector((state) => state.auth.login?.currentAccount);
  const navigate = useNavigate();

  useEffect(() => {
    if (!account) {
      navigate("/auth");
    }
  }, [account, navigate]);

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
