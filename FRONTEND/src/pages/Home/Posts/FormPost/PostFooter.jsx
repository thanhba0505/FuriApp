import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";

import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import SentimentDissatisfiedTwoToneIcon from "@mui/icons-material/SentimentDissatisfiedTwoTone";

import SentimentVerySatisfiedRoundedIcon from "@mui/icons-material/SentimentVerySatisfiedRounded";
import SentimentVerySatisfiedTwoToneIcon from "@mui/icons-material/SentimentVerySatisfiedTwoTone";

const StyledIcon = styled("div")(({ theme, color }) => ({
  display: "inline-block",
  color: color,
  marginRight: "12px",
  transition: "transform 0.44s ease",

  "&:hover": {
    transform: "scale(1.2)",
  },
  "&>svg": {
    fontSize: "30px",
  },
}));

const IconCustom = ({ Icon, color, onClick }) => {
  return (
    <StyledIcon color={color} onClick={onClick}>
      <Icon />
    </StyledIcon>
  );
};

const Interact = () => {
  const [interact, setInteract] = useState(null);

  const handleInteract = (type) => () => {
    setInteract(interact === type ? null : type);
  };

  return (
    <>
      <IconCustom
        Icon={
          interact === "like" ? FavoriteTwoToneIcon : FavoriteBorderRoundedIcon
        }
        color={interact === "like" ? "blue" : ""}
        onClick={handleInteract("like")}
      />
      <IconCustom
        Icon={
          interact === "laugh"
            ? SentimentVerySatisfiedTwoToneIcon
            : SentimentVerySatisfiedRoundedIcon
        }
        color={interact === "laugh" ? "orange" : ""}
        onClick={handleInteract("laugh")}
      />
      <IconCustom
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

function PostFooter() {
    console.log("ádfads");
  return (
    <Box
      marginTop={2}
      borderTop={1}
      borderColor={"text.primary"}
      paddingTop={1}
    >
      <Grid container columnSpacing={"16px"}>
        <Grid item xs height={"28px"}>
          <Interact />
        </Grid>

        <Grid item xs>
          <Box>
            
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PostFooter;
