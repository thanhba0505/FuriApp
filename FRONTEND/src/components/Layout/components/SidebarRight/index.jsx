import Grid from "@mui/material/Grid";

function SidebarRight({ children, xs = {} }) {
  return <Grid item xs={xs}>{children}</Grid>;
}

export default SidebarRight;
