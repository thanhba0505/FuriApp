import { Avatar, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import appInfo from "~/utils/appInfo";

function Layout({ children, bg = true }) {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const accountId = account?._id;
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const [isDisabled, setIsDisabled] = useState(window.innerWidth <=  1280);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <=  1280) {
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [navigate]);

  useEffect(() => {
    if (accessToken) {
      const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

      socket.on("newMess" + accountId, ({ fullname, sender, conversation }) => {
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
        {isDisabled && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "background.paper",
              zIndex: 99999,
              display: "flex",
              gap: 1,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Avatar src={appInfo.logoApp} variant="rounded" />
            <Typography variant="h6" textAlign={"center"} px={2}>
              Application not supported on small screens
            </Typography>
          </Box>
        )}

        <Box>{children}</Box>
      </Container>
    </Box>
  );
}

export default Layout;
