import Layout from "~/components/Layout";
import Body from "~/components/Layout/components";
import Header from "../components/Header";
import Content from "../components/Content";

function DefaultLayout({ children }) {
  return (
    <Layout>
      <Header />

      <Body>
        <Content xs={12}>{children}</Content>
      </Body>
    </Layout>
  );
}

export default DefaultLayout;
