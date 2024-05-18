import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
function samePageLinkNavigation(event) {
  if (
    event.defaultPrevented ||
    event.button !== 0 || // ignore everything but left-click
    event.metaKey ||
    event.ctrlKey ||
    event.altKey ||
    event.shiftKey
  ) {
    return false;
  }
  return true;
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        // Routing libraries handle this, you can remove the onClick handle when using them.
        if (samePageLinkNavigation(event)) {
          // event.preventDefault();
          // window.history.pushState(state, title, "/pro");
        }
      }}
      aria-current={props.selected && "page"}
      {...props}
    />
  );
}

LinkTab.propTypes = {
  selected: PropTypes.bool,
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

import Paper from "~/components/Paper";
import { NavLink } from "react-router-dom";

function Profile() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    // event.type can be equal to focus with selectionFollowsFocus.
    if (
      event.type !== "click" ||
      (event.type === "click" && samePageLinkNavigation(event))
    ) {
      setValue(newValue);
    }
  };
  const currentUrl = window.location.href;

  const Div = () => {
    if (currentUrl == "http://localhost:5173/profile") {
      return <Box>0</Box>;
    } else if (currentUrl == "http://localhost:5173/profilea") {
      return <Box>1</Box>;
    } else {
      return <Box>2</Box>;
    }
  };

  return (
    <>
      <Paper>
        <Box sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="nav tabs example"
            role="navigation"
          >
            <NavLink to="/profile">áldfasd</NavLink>
            <NavLink to="/profilea">a</NavLink>
            <NavLink to="/profileb">b</NavLink>
          </Tabs>
        </Box>

        <Box>{currentUrl}</Box>

        <Div />

        <NavLink to="/profile">áldfasd</NavLink>
      </Paper>
    </>
  );
}

export default Profile;
