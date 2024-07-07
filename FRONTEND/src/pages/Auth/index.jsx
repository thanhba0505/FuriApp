import Grid from "@mui/material/Grid";
import Paper from "~/components/Paper";

import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Login from "./Login";
import Register from "./Register";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Typography } from "@mui/material";
import { setPageLogin, setPageRegister } from "~/redux/otherSlice";
import appInfo from "~/utils/appInfo";

const Auth = () => {
  const dispatch = useDispatch();
  const page = useSelector((state) => state.other.authPage?.page);

  const [value, setValue] = React.useState(page);

  const handleChange = (event, newValue) => {
    if (newValue == "login") {
      dispatch(setPageLogin());
    } else if (newValue == "register") {
      dispatch(setPageRegister());
    }
    setValue(newValue);
  };

  return (
    <>
      <Paper mt={false} h={"100%"} mh={"1000px"}>
        <Grid container wrap="nowrap" height={"94%"} justifyContent={"center"}>
          <Grid
            item
            container
            xs={3}
            alignItems={"center"}
            justifyContent={"center"}
            flexDirection={"column"}
          >
            <Avatar
              src={appInfo.logoApp}
              variant="rounded"
              sx={{ height: 80, width: 80 }}
            />
            <Typography variant="h6" fontSize={26} fontWeight={600} mt={2}>
              FuriApp
            </Typography>
          </Grid>

          <Grid item xs={8} py={3} px={10}>
            <Box sx={{ width: "100%", typography: "body1", height: "100%" }}>
              <TabContext value={value}>
                <Box
                  sx={{ borderBottom: 1, borderColor: "divider", height: 50 }}
                >
                  <TabList
                    onChange={handleChange}
                    aria-label="lab API tabs example"
                    variant="fullWidth"
                    centered
                  >
                    <Tab label="Login" value="login" />
                    <Tab label="Register" value="register" />
                  </TabList>
                </Box>

                <TabPanel
                  sx={{ px: 0, py: 6, height: "calc(100% - 50px)" }}
                  value="login"
                >
                  <Login />
                </TabPanel>

                <TabPanel
                  sx={{ px: 0, py: 6, height: "calc(100% - 50px)" }}
                  value="register"
                >
                  <Register />
                </TabPanel>
              </TabContext>
            </Box>
          </Grid>
        </Grid>

        <Grid
          container
          alignItems={"center"}
          justifyContent={"center"}
          height={"6%"}
        >
          <Grid item>
            <Typography variant="body1">FuriApp v1.0</Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

const AuthMemo = React.memo(Auth);

export default AuthMemo;
