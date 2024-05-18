import Sidebar from "../components/SidebarLeft";
import Paper from "~/components/Paper";

function SidebarLeft({ xs = {} }) {
  return (
    <Sidebar xs={xs} >
      <Paper>Left Sidebar</Paper>
    </Sidebar>
  );
}

export default SidebarLeft;
