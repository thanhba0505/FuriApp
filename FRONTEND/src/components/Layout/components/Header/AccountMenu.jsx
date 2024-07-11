import React, { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Logout from "@mui/icons-material/Logout";
import ListItemIcon from "@mui/material/ListItemIcon";

import { logOut } from "~/api/accountApi";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import { enqueueSnackbar } from "notistack";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";

function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const fullname = account?.fullname;
  const avatar = account?.avatar;
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogOut = async () => {
    try {
      setLoading(true);
      const res = await logOut(dispatch, accessToken);
      if (res.status == 200) {
        enqueueSnackbar(res.message, {
          variant: "success",
        });
      } else {
        enqueueSnackbar(res.message, {
          variant: "error",
        });
      }
      setLoading(false);
    } catch (error) {
      console.log({ error });
    }
  };

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
          <Avatar src={avatar ? avatar : ""}>
            {!avatar && getFirstLetterUpperCase(fullname)}
          </Avatar>
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
        <MenuItem onClick={handleLogOut}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout{loading && "..."}
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}

const AccountMenuMemo = React.memo(AccountMenu);

export default AccountMenuMemo;
