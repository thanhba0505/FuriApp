/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/display-name */
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import { Avatar, CircularProgress, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useCallback } from "react";
import { getNotify } from "~/api/notification";
import { useState } from "react";
import EllipsisTypography from "~/components/EllipsisTypography";
import { io } from "socket.io-client";
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
        if (res.status == 200) {
          setImg(res.url);
        } else {
          console.log({ res });
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if (accessToken && item?.data?.sender?.avatar) {
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
  const accountId = account?._id;
  const socketRef = useRef(null);

  const limit = 100;

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

  useEffect(() => {
    if (accessToken) {
      const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

      socket.on("newNotification" + accountId, () => {
        fetchApi();
      });

      return () => {
        if (socketRef.current) {
          socketRef.current.close();
          socketRef.current = null;
        }
      };
    }
  }, [accessToken, accountId, fetchApi]);

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
          minHeight={400}
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
