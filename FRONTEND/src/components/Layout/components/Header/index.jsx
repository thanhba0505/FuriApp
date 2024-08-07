import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import NotifyMenu from "./NotifyMenu";
import AccountMenu from "./AccountMenu";
import Box from "@mui/material/Box";
import appInfo from "~/utils/appInfo";
import ModeSelect from "~/components/ModeSelect";
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        backgroundColor: "custom.backgroundApp",
        position: "relative",
        // boxShadow: 1,
        paddingX: (theme) => `${theme.furi.global.paddingX}`,
      }}
    >
      <AppBar
        position="static"
        sx={{
          backgroundColor: "background.default",
          margin: "0",
          boxShadow: "none",
          color: (theme) => `${theme.palette.text.primary}`,
          height: (theme) => `${theme.furi.header.height}`,
        }}
      >
        <Toolbar sx={{ height: "100%", paddingX: "0px !important" }}>
          <img
            src={appInfo.logoApp}
            alt="logo"
            width="40"
            height="40"
            style={{ borderRadius: "6px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          />

          <Typography
            variant="h6"
            component="div"
            pl={2}
            fontWeight={700}
            sx={{ flexGrow: 1, userSelect: "none" }}
          >
            {appInfo.nameApp}
          </Typography>

          <ModeSelect />

          {/* <SearchField /> */}

          <NotifyMenu />
          {/* <MessMenu /> */}
          <AccountMenu />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

const HeaderMemo = React.memo(Header);

export default HeaderMemo;
