import { Avatar, Button } from "@mui/material";

function ButtonIconCustom({ children, onClick, src }) {
  return (
    <Button
      onClick={onClick}
      variant="outlined"
      sx={{
        padding: "4px",
        width: "auto",
        minWidth: "unset",
        border: "none",
        borderRadius: "13px",
        "&:hover": {
          border: "none",
          backgroundColor: (theme) => `${theme.palette.action.disabled}`,
        },
      }}
    >
      <Avatar
        src={src}
        sx={{
          bgcolor: "transparent",
          color: "#fff",
          width: "40px",
          height: "40px",
          padding: "4px",
          border: `3px solid #fff`,
          borderRadius: "10px",
          ".MuiAvatar-img": {
            borderRadius: "6px",
            overflow: "hidden",
          },
          ".MuiSvgIcon-root": {
            fontSize: "2rem"
          },
        }}
      >
        {children}
      </Avatar>
    </Button>
  );
}

export default ButtonIconCustom;
