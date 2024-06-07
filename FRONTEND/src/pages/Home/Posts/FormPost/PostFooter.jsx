import { useEffect, useMemo, useRef, useState } from "react";
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

const Interact = () => {
  const [interact, setInteract] = useState(null);

  const handleInteract = (type) => () => {
    setInteract(interact === type ? null : type);
  };

  return (
    <>
      <IconCustomInteract
        Icon={
          interact === "like" ? FavoriteTwoToneIcon : FavoriteBorderRoundedIcon
        }
        color={interact === "like" ? "blue" : ""}
        onClick={handleInteract("like")}
      />
      <IconCustomInteract
        Icon={
          interact === "laugh"
            ? SentimentVerySatisfiedTwoToneIcon
            : SentimentVerySatisfiedRoundedIcon
        }
        color={interact === "laugh" ? "orange" : ""}
        onClick={handleInteract("laugh")}
      />
      <IconCustomInteract
        Icon={
          interact === "angry"
            ? SentimentDissatisfiedTwoToneIcon
            : SentimentDissatisfiedRoundedIcon
        }
        color={interact === "angry" ? "red" : ""}
        onClick={handleInteract("angry")}
      />
    </>
  );
};

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

const IconCustomNumInteract = ({ Icon, color, left, zIndex, onClick }) => {
  return (
    <StyledIconNumInteract
      zIndex={zIndex}
      color={color}
      left={left}
      onClick={onClick}
      favoriteIcon={Icon == FavoriteTwoToneIcon ? true : false}
    >
      <Icon />
    </StyledIconNumInteract>
  );
};

const NumInteract = ({ interact }) => {
  const countTypes = (arr) => {
    return arr.reduce((acc, obj) => {
      const type = obj.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  };

  const count = countTypes(interact);
  console.log(count);

  return (
    <Box sx={{ position: "relative", height: "100%", width: "100%" }}>

      <IconCustomNumInteract
        Icon={FavoriteTwoToneIcon}
        color="blue"
        zIndex={3}
      />
      <IconCustomNumInteract
        Icon={SentimentDissatisfiedTwoToneIcon}
        color="orange"
        left="20px"
        zIndex={2}
      />
      <IconCustomNumInteract
        Icon={SentimentVerySatisfiedTwoToneIcon}
        color="red"
        left="40px"
        zIndex={1}
      />
      <Typography
        sx={{
          position: "absolute",
          bottom: "4px",
          left: "70px",
          userSelect: "none",
        }}
        variant="body1"
        lineHeight={"1"}
      >
        {interact?.length} Interaction
      </Typography>
    </Box>
  );
};

const Comment = ({ index, avatar, name, comment, mt = true }) => {
  return (
    <Grid key={index} container wrap="nowrap" mt={mt ? 1.2 : ""}>
      <Grid item>
        <Avatar
          src={avatar}
          alt={name}
          sx={{ width: 32, height: 32, mr: 1.2 }}
        />
      </Grid>
      <Grid
        item
        sx={{
          border: 1,
          borderColor: "secondary.light",
          p: 1,
          mr: 2,
          borderRadius: 2,
        }}
      >
        <Typography
          variant="body1"
          fontSize={"13px"}
          fontWeight={700}
          lineHeight={1}
        >
          {name}
        </Typography>
        <Typography lineHeight={1.1} mt={"2px"} fontSize={"14px"}>
          {" "}
          {comment}
        </Typography>
      </Grid>
    </Grid>
  );
};

const PostComment = ({ expanded, comment }) => {
  const [commentLoaded, setCommentLoad] = useState(false);

  useEffect(() => {
    if (expanded === "panel" && !commentLoaded) {
      setCommentLoad(true);
    }
  }, [expanded, commentLoaded]);

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
              {comment &&
                comment.map((cmt, index) => (
                  <Comment
                    key={index}
                    name={cmt.account?.fullname}
                    comment={cmt.content}
                    mt={index !== 0}
                  />
                ))}
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </>
  );
};

const AddComment = ({ focused, onFocusChange, isButtonClick }) => {
  const textFieldRef = useRef(null);

  const handleFocusChange = () => {
    onFocusChange(true);
  };

  const handleBlur = () => {
    if (!isButtonClick.current) {
      onFocusChange(false);
    }
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
      >
        Send
      </Button>
    </>
  );
};

const PostFooter = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const [focused, setFocused] = useState(false);
  const isButtonClick = useRef(false);

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
              {post?.comment?.length} comment
            </Typography>
          </Grid>
        </Grid>
      </Box>

      {/* interact */}
      <Box marginTop={1} borderTop={1} borderColor={"divider"} paddingTop={1}>
        <Grid container columnSpacing={"16px"}>
          <Grid item xs container alignItems={"end"} height={"28px"}>
            <Interact />
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
        <PostComment expanded={expanded} comment={post?.comment} />
      </Box>

      {/* add comment */}
      <Box mt={2}>
        <AddComment
          focused={focused}
          onFocusChange={handleFocusChange}
          isButtonClick={isButtonClick}
        />
      </Box>
    </>
  );
};

export default PostFooter;
