import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVertTwoTone";
import Menu from "@mui/material/Menu";
import AvatarMore from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { useEffect, useState } from "react";
import { getImageBlob } from "~/api/imageApi";
import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";
import formatTimeDifference from "~/config/formatTimeDifference";
import { useNavigate } from "react-router-dom";
import LinkIcon from "@mui/icons-material/Link";
import PreviewIcon from "@mui/icons-material/Preview";

function PostHeader({ fullName, date, avatar, accountId, postId }) {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [img, setImg] = useState();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await getImageBlob(accessToken, avatar);
        if (res.status === 200) {
          setImg(res.url);
        } else {
          console.log({ res });
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (avatar && accessToken) {
      fetchImage();
    }
  }, [avatar, accessToken]);

  return (
    <Grid container columnSpacing={"16px"} alignItems={"center"}>
      <Grid item xs={"auto"}>
        <Avatar
          onClick={() => navigate("/profile/" + accountId)}
          src={img ? img : ""}
          variant="rounded"
          sx={{ width: 40, height: 40, cursor: "pointer" }}
        >
          {!img && getFirstLetterUpperCase(fullName)}
        </Avatar>
      </Grid>

      <Grid item xs>
        <Box>
          <Typography variant="body1" fontWeight={700}>
            {fullName}
          </Typography>
          <Typography variant="body2">{formatTimeDifference(date)}</Typography>
        </Box>
      </Grid>

      <Grid item xs={"auto"}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <AvatarMore
            sx={{
              width: 32,
              height: 32,
              backgroundColor: "unset",
              color: "text.primary",
            }}
          >
            <MoreVertIcon />
          </AvatarMore>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
              "&::before": {
                content: '""',
                display: "block",
                position: "absolute",
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: "background.paper",
                transform: "translateY(-50%) rotate(45deg)",
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              navigate("/post/" + postId);
            }}
          >
            <ListItemIcon>
              <PreviewIcon fontSize="small" />
            </ListItemIcon>
            See post
          </MenuItem>

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <LinkIcon fontSize="small" />
            </ListItemIcon>
            Copy link
          </MenuItem>
          <Divider />

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              <Logout fontSize="small" />
            </ListItemIcon>
            Coming soon
          </MenuItem>
        </Menu>
      </Grid>
    </Grid>
  );
}

export default PostHeader;
