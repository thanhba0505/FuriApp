/* eslint-disable react/display-name */
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Avatar, Button, TextField } from "@mui/material";
import { styled } from "@mui/system";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SendIcon from "@mui/icons-material/Send";
import AddCommentIcon from "@mui/icons-material/AddComment";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";

import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import SentimentDissatisfiedTwoToneIcon from "@mui/icons-material/SentimentDissatisfiedTwoTone";

import SentimentVerySatisfiedRoundedIcon from "@mui/icons-material/SentimentVerySatisfiedRounded";
import SentimentVerySatisfiedTwoToneIcon from "@mui/icons-material/SentimentVerySatisfiedTwoTone";
import { getImageBlob } from "~/api/imageApi";
import { addComment, getInteract } from "~/api/postApi";
import formatTimeDifference from "~/config/formatTimeDifference";

const StyledIconInteract = styled("div")(({ color }) => ({
  display: "block",
  color: color,
  marginRight: "12px",
  transition: "transform 0.44s ease",

  "&:hover": {
    transform: "scale(1.2)",
  },
  "&>svg": {
    fontSize: "30px",
    display: "block",
  },
}));

const IconCustomInteract = ({ Icon, color, onClick }) => {
  return (
    <StyledIconInteract color={color} onClick={onClick}>
      <Icon />
    </StyledIconInteract>
  );
};

const Interact = React.memo(
  ({ typeInteract, getTypeInteractCurrentAccount }) => {
    const handleInteract = (type) => () => {
      getTypeInteractCurrentAccount({ type });
    };

    return (
      <>
        <IconCustomInteract
          Icon={
            typeInteract === "like"
              ? FavoriteTwoToneIcon
              : FavoriteBorderRoundedIcon
          }
          color={typeInteract === "like" ? "blue" : ""}
          onClick={handleInteract("like")} // Gọi handleInteract với loại interact tương ứng
        />
        <IconCustomInteract
          Icon={
            typeInteract === "laugh"
              ? SentimentVerySatisfiedTwoToneIcon
              : SentimentVerySatisfiedRoundedIcon
          }
          color={typeInteract === "laugh" ? "orange" : ""}
          onClick={handleInteract("laugh")} // Gọi handleInteract với loại interact tương ứng
        />
        <IconCustomInteract
          Icon={
            typeInteract === "angry"
              ? SentimentDissatisfiedTwoToneIcon
              : SentimentDissatisfiedRoundedIcon
          }
          color={typeInteract === "angry" ? "red" : ""}
          onClick={handleInteract("angry")} // Gọi handleInteract với loại interact tương ứng
        />
      </>
    );
  }
);

const StyledIconNumInteract = styled("div")(
  ({ theme, color, left, zIndex, favoriteIcon }) => ({
    display: "block",
    color: color,
    position: "absolute",
    left: left || 0,
    top: 0,
    backgroundColor: theme.lableSelect,
    borderRight: !favoriteIcon
      ? `3px solid ${theme.lableSelect}`
      : `2px solid ${theme.lableSelect}`,
    borderRadius: !favoriteIcon ? "50%" : "30% 30% 70% 70%",
    zIndex: zIndex,

    "&>svg": {
      fontSize: "24px",
      display: "block",
    },
  })
);

const IconCustomNumInteract = React.memo(
  ({ Icon, color, left, zIndex, onClick }) => {
    return (
      <StyledIconNumInteract
        zIndex={zIndex}
        color={color}
        left={left}
        onClick={onClick}
        favoriteIcon={Icon === FavoriteTwoToneIcon ? true : false}
      >
        <Icon />
      </StyledIconNumInteract>
    );
  }
);

const NumInteract = React.memo(({ interact }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accountID = account?._id;
  const isAccountInInteract = interact.find(
    (item) => item.account === accountID
  );

  const countTypes = (arr) => {
    return arr.reduce((acc, obj) => {
      const type = obj.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  };

  const count = countTypes(interact);

  const interactTypes = [
    {
      type: "like",
      count: count.like || 0,
      Icon: FavoriteTwoToneIcon,
      color: "blue",
    },
    {
      type: "angry",
      count: count.angry || 0,
      Icon: SentimentDissatisfiedTwoToneIcon,
      color: "red",
    },
    {
      type: "laugh",
      count: count.laugh || 0,
      Icon: SentimentVerySatisfiedTwoToneIcon,
      color: "orange",
    },
  ];

  const filteredInteractTypes = interactTypes
    .filter((interactType) => interactType.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>
      {filteredInteractTypes.map((interactType, index) => (
        <IconCustomNumInteract
          key={interactType.type}
          Icon={interactType.Icon}
          color={interactType.color}
          left={`${index * 20}px`}
          zIndex={filteredInteractTypes.length - index}
        />
      ))}
      <Typography
        sx={{
          position: "absolute",
          bottom: "4px",
          left:
            filteredInteractTypes.length > 0
              ? `${filteredInteractTypes.length * 20 + 10}px`
              : "0px",
          userSelect: "none",
        }}
        variant="body1"
        lineHeight={"1"}
      >
        {isAccountInInteract && interact?.length - 1 > 0
          ? "You and " +
            (interact?.length - (isAccountInInteract ? 1 : 0)) +
            " others"
          : isAccountInInteract
          ? "You"
          : interact?.length + " others"}
      </Typography>
    </Box>
  );
});

const Comment = React.memo(({ index, cmt, accessToken, mt = true }) => {
  const [img, setImg] = useState("");
  const formatDate =
    formatTimeDifference(cmt?.createdAt) != "0 minutes ago"
      ? formatTimeDifference(cmt?.createdAt)
      : "Just now";

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, cmt.account.avatar);
        setImg(result);
      } catch (error) {
        console.log({ error });
      }
    };

    if (cmt.account.avatar && accessToken) {
      fetchImage();
    }
  }, [cmt.account.avatar, accessToken]);

  return (
    <Grid key={index} container wrap="nowrap" mt={mt ? 1.4 : ""}>
      <Grid item>
        <Avatar
          src={img}
          alt={cmt?.account?.fullname}
          sx={{ width: 32, height: 32, mr: 1.2 }}
        />
      </Grid>
      <Grid item>
        <Box
          sx={{
            border: 1,
            borderColor: "secondary.light",
            p: 1.2,
            mr: 2,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="body1"
            fontSize={"14px"}
            fontWeight={700}
            lineHeight={1}
          >
            {cmt?.account?.fullname}
          </Typography>
          <Typography lineHeight={1.1} mt={"4px"} fontSize={"16px"}>
            {cmt?.content}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          mt={"4px"}
          px={1}
          lineHeight={1.1}
          fontSize={"11px"}
        >
          {formatDate}
        </Typography>
      </Grid>
    </Grid>
  );
});

const PostComment = React.memo(({ expanded, comments, postId }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  const [listComment, setListComment] = useState(comments);
  const [commentLoaded, setCommentLoad] = useState(false);

  useEffect(() => {
    if (expanded === "panel" && !commentLoaded) {
      setCommentLoad(true);
    }
  }, [expanded, commentLoaded]);

  useEffect(() => {
    setListComment(comments);
  }, [comments]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

    socket.on("newComment_" + postId, ({ addedComment }) => {
      setListComment((prevComments) => [...prevComments, addedComment]);
      console.log(addedComment);
    });

    return () => {
      socket.disconnect();
    };
  }, [postId]);

  return (
    <>
      <Accordion
        expanded={commentLoaded && expanded === "panel"}
        sx={{
          backgroundColor: (theme) => `${theme.lableSelect}`,
          boxShadow: "none",
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ display: "none" }}
        ></AccordionSummary>
        <AccordionDetails
          sx={{
            p: 0,
            pt: 2,
            backgroundColor: (theme) => `${theme.lableSelect}`,
          }}
        >
          {commentLoaded && (
            <Box
              sx={{
                maxHeight: "400px",
                overflowY: "auto",
                pb: "2px",
                "::-webkit-scrollbar": {
                  width: "4px",
                  height: "8px",
                  backgroundColor: "action.hover",
                },
                "::-webkit-scrollbar-thumb": {
                  backgroundColor: "action.hover",
                },
              }}
            >
              {listComment?.map((cmt, index) => (
                <Comment
                  key={index}
                  accessToken={accessToken}
                  cmt={cmt}
                  mt={index !== 0}
                />
              ))}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
});

const AddComment = React.memo(
  ({ focused, postID, onFocusChange, isButtonClick }) => {
    const account = useSelector((state) => state.auth?.login?.currentAccount);
    const accessToken = account?.accessToken;

    const [content, setContent] = useState("");
    const textFieldRef = useRef(null);

    const handleFocusChange = () => {
      onFocusChange(true);
    };

    const handleBlur = () => {
      if (!isButtonClick.current) {
        onFocusChange(false);
      }
    };

    const handleOnchange = (e) => {
      const newValue = e.target.value;
      if (newValue !== content) {
        setContent(newValue);
      }
    };

    const handleSend = () => {
      const getTypeInteractCurrentAccount = async () => {
        if (accessToken && content.trim().length > 0) {
          try {
            await addComment(accessToken, postID, content);
            setContent("");
          } catch (error) {
            console.log({ error });
          }
        }
      };

      getTypeInteractCurrentAccount();
    };

    useEffect(() => {
      if (focused && textFieldRef.current) {
        textFieldRef.current.focus();
      }
    }, [focused]);

    return (
      <>
        <TextField
          sx={{ width: "calc(100% - 130px)", mr: "10px" }}
          placeholder="Write your comment here..."
          size="small"
          multiline
          inputRef={textFieldRef}
          onFocus={handleFocusChange}
          onBlur={handleBlur}
          value={content}
          onChange={handleOnchange}
        />

        <Button
          color="secondary"
          sx={{
            height: "100%",
            px: "16px !important",
            py: "8px !important",
            minWidth: "120px",
            boxShadow: "none",
          }}
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleSend}
        >
          Send
        </Button>
      </>
    );
  }
);

const PostFooter = ({ post }) => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  const [expanded, setExpanded] = useState(false);
  const [focused, setFocused] = useState(false);
  const [typeInteract, setTypeInteract] = useState(null);
  const [count, setCount] = useState(post?.comment?.length);
  const isButtonClick = useRef(false);

  useEffect(() => {
    const getTypeInteractCurrentAccount = async () => {
      if (accessToken) {
        try {
          const res = await getInteract(accessToken, post._id, null);
          setTypeInteract(res);
        } catch (error) {
          console.log({ error });
        }
      }
    };

    getTypeInteractCurrentAccount();
  }, [accessToken, post._id]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_FURI_API_BASE_URL);

    socket.on("newComment_" + post._id, () => {
      setCount((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [post._id]);

  const getTypeInteractCurrentAccount = async ({ type = null }) => {
    if (accessToken) {
      try {
        const res = await getInteract(accessToken, post._id, type);
        setTypeInteract(res);
      } catch (error) {
        console.log({ error });
      }
    }
  };

  const handleCommentClick = () => {
    isButtonClick.current = true;
    setExpanded(!expanded ? "panel" : false);
    setTimeout(() => {
      isButtonClick.current = false;
    }, 0);
  };

  const handleFocusChange = (isFocus) => {
    setFocused(isFocus);
  };

  const handleButtonAddComment = () => {
    isButtonClick.current = true;
    handleFocusChange(!focused);
    setTimeout(() => {
      isButtonClick.current = false;
    }, 0);
  };

  return (
    <>
      {/* num like and comment */}
      <Box marginTop={1} paddingTop={1}>
        <Grid container columnSpacing={"16px"}>
          <Grid item xs container alignItems={"center"} height={"24px"}>
            <NumInteract interact={post?.interact} />
          </Grid>

          <Grid item xs container alignItems={"center"} justifyContent={"end"}>
            <Typography
              variant="body1"
              lineHeight={"1"}
              sx={{ cursor: "pointer", userSelect: "none" }}
              onClick={() => {
                handleCommentClick();
              }}
            >
              {count} comment
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* interact */}
      <Box marginTop={1} borderTop={1} borderColor={"divider"} paddingTop={1}>
        <Grid container columnSpacing={"16px"}>
          <Grid item xs container alignItems={"end"} height={"28px"}>
            {typeInteract && (
              <Interact
                typeInteract={typeInteract.type}
                getTypeInteractCurrentAccount={getTypeInteractCurrentAccount}
              />
            )}
          </Grid>

          <Grid item>
            <Button
              onClick={handleButtonAddComment}
              variant="outlined"
              endIcon={<AddCommentIcon />}
              color="inherit"
            >
              Add comment
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* comment */}
      <Box mt={1} borderTop={1} borderColor={"divider"}>
        <PostComment
          expanded={expanded}
          comments={post?.comment}
          postId={post?._id}
        />
      </Box>

      {/* add comment */}
      <Box mt={2}>
        <AddComment
          focused={focused}
          onFocusChange={handleFocusChange}
          isButtonClick={isButtonClick}
          postID={post._id}
        />
      </Box>
    </>
  );
};

const PostFooterMemo = React.memo(PostFooter);

export default PostFooterMemo;
