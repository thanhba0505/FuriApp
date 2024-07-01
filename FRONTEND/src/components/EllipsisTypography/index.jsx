import { Typography } from "@mui/material";
import { styled } from "@mui/system";

const StyledTypography = styled(Typography)(({ lines }) => ({
  overflow: "hidden",
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: lines,
  textOverflow: "ellipsis",
  whiteSpace: "normal",
}));

const EllipsisTypography = ({ children, lines = 1, ...props }) => {
  return (
    <StyledTypography lines={lines} {...props}>
      {children}
    </StyledTypography>
  );
};

export default EllipsisTypography;
