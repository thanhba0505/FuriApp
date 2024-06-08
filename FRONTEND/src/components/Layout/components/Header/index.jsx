import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import MessMenu from "./MessMenu";
import NotifyMenu from "./NotifyMenu";
import AccountMenu from "./AccountMenu";
import SearchField from "./SearchField";
import Box from "@mui/material/Box";
import appInfo from "~/utils/appInfo";

function Header() {
  return (
    <Box
      sx={{
        backgroundColor: "background.default",
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
            style={{ borderRadius: "6px" }}
          />

          <Typography
            variant="h6"
            component="div"
            pl={2}
            fontWeight={700}
            sx={{ flexGrow: 1 }}
          >
            {appInfo.nameApp}
          </Typography>

          {/* <SearchField /> */}

          {/* <NotifyMenu />
          <MessMenu />
          <AccountMenu /> */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
