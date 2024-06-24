import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
// import { useSelector } from "react-redux";
// import { useParams } from "react-router-dom";
// import { readMessage } from "~/api/conversationApi";

function Layout({ children, bg = true }) {
  // const account = useSelector((state) => state.auth?.login?.currentAccount);
  // const accessToken = account?.accessToken;
  // const { conversationId } = useParams();

  // const handleClickGlobal = () => {
  //   const fetchApi = async () => {
  //     const res = await readMessage(accessToken, conversationId);
  //     if (res.status != 200) {
  //       console.log({ res });
  //     }
  //   };

  //   if (conversationId) {
  //     fetchApi();
  //   }
  // };

  return (
    <Box
      // onClick={handleClickGlobal}
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
