/* eslint-disable react/display-name */
import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Avatar, Button, Typography } from "@mui/material";
import PersonAdd from "@mui/icons-material/PersonAdd";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import NotifyIcon from "@mui/icons-material/NotificationsNone";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { getNotify } from "~/api/notification";
import { useState } from "react";
import EllipsisTypography from "~/components/EllipsisTypography";
import { io } from "socket.io-client";
import { enqueueSnackbar } from "notistack";
import { getImageBlob } from "~/api/imageApi";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import getFirstLetterUpperCase from "~/config/getFirstLetterUpperCase";
import formatTimeDifference from "~/config/formatTimeDifference";

const NotifyItem = memo(({ onClick, item }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const navigate = useNavigate();

  const [img, setImg] = useState(null);

  useEffect(() => {
    const fetchApiImg = async () => {
      try {
        const res = await getImageBlob(accessToken, item?.data?.sender?.avatar);
        console.log({ res });
        if (res.status == 200) {
          setImg(res.url);
        } else {
          console.log({ res });
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (accessToken & item?.data?.sender?.avatar) {
      fetchApiImg();
    }
  }, [accessToken, item?.data?.sender?.avatar]);

  const handleClickItem = () => {
    onClick();
    if (item?.type == "friend_request" || item?.type == "friend_accept") {
      navigate("/profile/" + item?.data?.sender?._id);
    }
  };

  return (
    <>
      <MenuItem onClick={handleClickItem} sx={{ py: 1 }}>
        <Avatar src={img ? img : null}>
          {!img && getFirstLetterUpperCase(item?.data?.sender?.fullname)}
        </Avatar>
        <Box pl={1} width={"100%"}>
          <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
            <Typography fontWeight={500}>
              {item?.data?.sender?.fullname}
            </Typography>
            <Typography textAlign={"end"} fontSize={13}>
              {formatTimeDifference(item?.createdAt)}
            </Typography>
          </Box>
          <EllipsisTypography color={"text.secondary"}>
            {item.message}
          </EllipsisTypography>
        </Box>
      </MenuItem>
      <Divider sx={{ m: "0px !important" }} />
    </>
  );
});

function NotifyMenu() {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const accountId = account?._id;
  const limit = 6;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const [items, setItems] = useState([]);

  const fetchApi = useCallback(async () => {
    if (accessToken) {
      try {
        const res = await getNotify(accessToken, limit);

        if (res.status == 200) {
          setItems(res.notifications);
        } else {
          console.log({ res });
        }
      } catch (error) {
        console.log({ error });
      }
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchApi();
    }
  }, [accessToken, fetchApi]);

  useEffect(() => {
    if (accessToken) {
      const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

      socket.on("newNotify" + accountId, ({ message }) => {
        enqueueSnackbar(message, {
          variant: "info",
          autoHideDuration: 5000,
        });

        fetchApi();
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [accessToken, accountId, fetchApi]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Avatar
            sx={{ width: 39, height: 39, backgroundColor: "primary.main" }}
            // variant="rounded"
          >
            <NotifyIcon fontSize="small" />
          </Avatar>
        </IconButton>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setAnchorEl(null);
        }}
        // onClick={() => {
        //   setAnchorEl(null);
        // }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 40,
              height: 40,
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
            // width: 350,
            minWidth: 350,
            maxWidth: 500,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {items && items.length > 0 ? (
          items.map((item) => (
            <NotifyItem
              key={item._id}
              onClick={() => setAnchorEl(null)}
              item={item}
            />
          ))
        ) : (
          <Typography textAlign={"center"} mt={3} mb={4}>
            No notification
          </Typography>
        )}

        <Divider />

        <MenuItem onClick={() => setAnchorEl(null)}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          See more
        </MenuItem>
      </Menu>
    </>
  );
}

export default NotifyMenu;
