import AvatarApp from "@mui/material/Avatar";

function Avatar({
  size = "40px",
  br,
  v = null,
  src = "/public/images/app/logo-furi.png",
}) {
  const srca = src;
  return (
    <AvatarApp
      variant={v}
      sx={{ width: size, height: size, borderRadius: br }}
      alt="avatar"
      src={srca}
    />
  );
}

export default Avatar;
