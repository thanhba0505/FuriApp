/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { Avatar, CircularProgress, Typography } from "@mui/material";
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

const NotificationItem = ({ onClick, item }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const navigate = useNavigate();

  const [img, setImg] = useState();

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
    } else if (item?.type == "post" || item?.type == "comment") {
      navigate("/post/" + item?.data?.post);
    }
  };

  return (
    <>
      <MenuItem onClick={handleClickItem} sx={{ py: 1.2 }}>
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
};

const Notification = ({ setAnchorEl }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  const limit = 6;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchApi = useCallback(async () => {
    if (accessToken) {
      try {
        setLoading(true);
        const res = await getNotify(accessToken, limit);

        if (res.status == 200) {
          setItems(res.notifications);
        } else {
          console.log({ res });
        }
        setLoading(false);
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

  return (
    <>
      {items && items.length > 0 ? (
        items.map((item) => (
          <NotificationItem
            key={item._id}
            onClick={() => setAnchorEl && setAnchorEl(null)}
            item={item}
          />
        ))
      ) : (
        <Typography
          textAlign={"center"}
          mt={3}
          mb={4}
          minHeight={300}
          alignContent={"center"}
        >
          {loading && <CircularProgress />}
          {!loading && items.length == 0 && "No notification"}
        </Typography>
      )}
    </>
  );
};

export default memo(Notification);
