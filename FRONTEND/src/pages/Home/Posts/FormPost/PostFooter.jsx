import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";

import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import SentimentDissatisfiedTwoToneIcon from "@mui/icons-material/SentimentDissatisfiedTwoTone";

import SentimentVerySatisfiedRoundedIcon from "@mui/icons-material/SentimentVerySatisfiedRounded";
import SentimentVerySatisfiedTwoToneIcon from "@mui/icons-material/SentimentVerySatisfiedTwoTone";

const StyledIconInteract = styled("div")(({ theme, color }) => ({
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

const NumInteract = () => {
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
    </Box>
  );
};

function PostFooter() {
  return (
    <>
      <Box marginTop={1} paddingTop={1}>
        <Grid container columnSpacing={"16px"}>
          <Grid item xs container alignItems={"center"} height={"24px"}>
            <NumInteract />
          </Grid>

          <Grid item xs container alignItems={"center"} justifyContent={"end"}>
            <Typography variant="body1" lineHeight={"1"}>
              1 comment
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box
        marginTop={2}
        borderTop={1}
        borderColor={"text.primary"}
        paddingTop={1}
      >
        <Grid container columnSpacing={"16px"}>
          <Grid item xs container alignItems={"end"} height={"28px"}>
            <Interact />
          </Grid>

          <Grid item xs>
            <Box></Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default PostFooter;
