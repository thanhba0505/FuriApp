import Layout from "~/components/Layout";
import Box from "@mui/material/Box";

function NoLayout({ children }) {
  return (
    <Layout bg={false}>
      <Box padding={3} height={"100%"}>
        {children}
      </Box>
    </Layout>
  );
}

export default NoLayout;
