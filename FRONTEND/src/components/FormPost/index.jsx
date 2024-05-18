import Avatar from "~/components/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "~/components/Paper";
import Grid from "@mui/material/Grid";
import MoreVertIcon from "@mui/icons-material/MoreVertTwoTone";

import * as React from "react";
import Menu from "@mui/material/Menu";
import AvatarMore from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";

function FormPost({ children, date }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper>
      <Grid container columnSpacing={"16px"}>
        <Grid item xs={"auto"}>
          <Avatar v={"rounded"} />
        </Grid>
        <Grid item xs>
          <Box>
            <Typography variant="body1" fontWeight={700}>
              Furina!
            </Typography>
            <Typography variant="body2">{date}</Typography>
          </Box>
        </Grid>
        <Grid item xs={"auto"}>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <AvatarMore
              sx={{
                width: 32,
                height: 32,
                backgroundColor: "unset",
                color: "text.primary",
              }}
            >
              <MoreVertIcon />
            </AvatarMore>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonAdd fontSize="small" />
              </ListItemIcon>
              Add another account
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
            <Divider />
          </Menu>
        </Grid>
      </Grid>
      
      {children}

      <Grid container columnSpacing={"16px"}>
        <Grid item xs={"auto"}>
          <Avatar v={"rounded"} />
        </Grid>
        <Grid item xs>
          <Box>
            <Typography variant="body1" fontWeight={700}>
              Furina!
            </Typography>
            <Typography variant="body2">{date}</Typography>
          </Box>
        </Grid>
        <Grid item xs={"auto"}></Grid>
      </Grid>

      {/* <Grid mt={2} container columnSpacing={"16px"}>
        <Grid item>{children}</Grid>
      </Grid> */}
    </Paper>
  );
}

export default FormPost;
