import Paper from "@mui/material/Paper";

export default function PaperCustom({
  children,
  bs = true,
  mt = true,
  p = "20px",
  h = null,
  br = "8px",
  mh = null,
  w = "100%",
  maxW = null,
  minW = null,
}) {
  return (
    <Paper
      sx={{
        boxShadow: bs,
        marginTop: (theme) => (mt ? theme.spacing(3) : "none"),
        overflow: "hidden",
        position: "relative",
        width: w,
        height: h,
        maxHeight: mh,
        minWidth: minW,
        maxWidth: maxW,
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
