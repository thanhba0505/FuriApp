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
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Typography } from "@mui/material";
import { setPageLogin, setPageRegister } from "~/redux/otherSlice";

function Auth() {
  const account = useSelector((state) => state.auth.login?.currentAccount);
  const navigate = useNavigate();

  useEffect(() => {
    if (account) {
      navigate("/");
    }
  }, [account, navigate]);

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
        <Grid
          container
          alignItems={"start"}
          justifyContent={"center"}
          height={"94%"}
          py={2}
        >
          <Grid item xs={7} py={3} px={10}>
            <Box sx={{ width: "100%", typography: "body1" }}>
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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

                <TabPanel sx={{ px: 0, py: 4 }} value="login">
                  <Login />
                </TabPanel>

                <TabPanel sx={{ px: 0, py: 4 }} value="register">
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
            <Typography variant="body1">FuriApp@gmail.com</Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default Auth;
