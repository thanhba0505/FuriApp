import Layout from "~/components/Layout";
import Body from "~/components/Layout/components";
import Header from "../components/Header";
import Content from "../components/Content";
import SidebarLeft from "./SidebarLeft";
import SidebarRight from "./SidebarRight";

function DefaultLayout({ children }) {
  return (
    <Layout>
      <Header />

      <Body>
        <SidebarLeft xs={3} />

        <Content xs={6}>{children}</Content>

        <SidebarRight xs={3}/>
      </Body>
    </Layout>
  );
}

export default DefaultLayout;
