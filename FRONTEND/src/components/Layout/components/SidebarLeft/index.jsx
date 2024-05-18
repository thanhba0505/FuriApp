import Grid from "@mui/material/Grid";

function SidebarLeft({ children, xs = {} }) {
  return <Grid item xs={xs}>{children}</Grid>;
}

export default SidebarLeft;
