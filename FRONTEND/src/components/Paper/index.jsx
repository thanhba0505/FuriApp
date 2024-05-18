import Paper from "@mui/material/Paper";

export default function PaperCustom({
  children,
  bs = true,
  mt = true,
  p = "20px",
  h = null,
  br = "8px",
  mh = null,
}) {
  return (
    <Paper 
      sx={{
        boxShadow: bs,
        marginTop: (theme) => (mt ? theme.spacing(3) : "none"),
        overflow: "hidden",
        position: "relative",
        width: "100%",
        height: h,
        maxHeight: mh,
        borderRadius: br,
        backgroundColor: (theme) => theme.palette.background.default,
        padding: p,
        ...(theme) => theme.typography.body2,
      }}
    >
      {children}
    </Paper>
  );
}
