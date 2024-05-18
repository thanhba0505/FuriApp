import Layout from "~/components/Layout";
import Body from "~/components/Layout/components";
import Header from "../components/Header";
import Content from "../components/Content";
import SidebarLeft from "./SidebarLeft";

function SidebarLeftLayout({ children }) {
  return (
    <Layout>
      <Header />

      <Body>
        <SidebarLeft xs={4} />

        <Content xs={8}>{children}</Content>
      </Body>
    </Layout>
  );
}

export default SidebarLeftLayout;
