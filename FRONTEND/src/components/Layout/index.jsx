import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";

function Layout({ children, bg = true }) {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const accountId = account?._id;
  const { conversationId } = useParams();

  useEffect(() => {
    if (accessToken) {
      const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

      socket.on("newMess" + accountId, ({ fullname, sender, conversation }) => {
        console.log(sender != accountId && conversation != conversationId);
        if (sender != accountId && conversation != conversationId) {
          enqueueSnackbar(fullname + " sent you a messages.", "info");
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [accountId, accessToken, conversationId]);

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
