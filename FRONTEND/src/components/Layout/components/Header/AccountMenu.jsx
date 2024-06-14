import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import PersonAdd from "@mui/icons-material/PersonAdd";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";

import ModeSelect from "~/components/ModeSelect";
import { logOut } from "~/api/accountApi";
import { useDispatch, useSelector } from "react-redux";
// import { getImage } from "~/api/imageApi";
import { useRef } from "react";
import Avatar from "@mui/material/Avatar";
import { getImageBlob } from "~/api/imageApi";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

function AccountMenu() {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const avatar = account?.avatar;
  const dispatch = useDispatch();

  const [img, setImg] = useState();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
    const res = await logOut(dispatch, accessToken);
    if (res) {
      enqueueSnackbar(res.message, {
        variant: res.status == 200 ? "success" : "error",
      });
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, avatar);
        setImg(result);
      } catch (error) {
        console.log({ error });
      }
    };
    if (avatar && accessToken) {
      fetchImage();
    }
  }, [avatar, accessToken]);

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar src={img ? img : ""} />
        </IconButton>
      </Box>

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
              right: 20,
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
        <MenuItem>
          <Avatar /> Profile
        </MenuItem>

        <MenuItem>
          <Avatar /> My account
        </MenuItem>

        <Divider />

        <MenuItem>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>

        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

const AccountMenuMemo = React.memo(AccountMenu);

export default AccountMenuMemo;
