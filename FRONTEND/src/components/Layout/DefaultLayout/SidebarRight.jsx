import Sidebar from "../components/SidebarRight";
import Paper from "~/components/Paper";

function SidebarRight({ xs = {} }) {
  return (
    <Sidebar xs={xs} >
      <Paper>Right Sidebar</Paper>
    </Sidebar>
  );
}

export default SidebarRight;
