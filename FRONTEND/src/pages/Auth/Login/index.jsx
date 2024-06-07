import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextInput from "~/components/TextInput";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

import { useEffect, useState } from "react";
import { loginAccount } from "~/api/accountApi";
import { useDispatch } from "react-redux";

import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function Login() {
  const [username, setUsername] = useState("bocchichan");
  const [password, setPassword] = useState("passtest123");
  const [checked, setChecked] = useState(true);

  const [disabled, setDisabled] = useState(true);
  
  const [error, setError] = useState("");
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    if (password === "" || username === "") {
      setDisabled(true);
    } else setDisabled(false);
  }, [password, username]);

  const dispatch = useDispatch();

  const handleLogin = () => {
    const newAccount = { username: username, password: password };
    loginAccount(newAccount, dispatch, setError, setOpen);
  };
  
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  return (
    <Box>
      <TextInput
        label="Username"
        type="text"
        placeholder="furiapp123"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextInput
        label="Password"
        type="password"
        placeholder="furi123#$%^&"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <FormGroup sx={{ height: "56px", width: "100%", mt: 2, mb: 1 }}>
        <FormControlLabel
          sx={{ height: "100%" }}
          control={<Checkbox />}
          checked={checked}
          onChange={() => setChecked(!checked)}
          label="Keep me logged in"
        />
      </FormGroup>

      <Button
        variant="contained"
        sx={{ height: "56px", width: "100%", mt: 2, mb: 1 }}
        onClick={!disabled ? handleLogin : null}
        disabled={disabled}
      >
        Login
      </Button>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        sx={{
          bottom: "30px!important",
          right: "30px!important",
          maxHeight: "30vw",
        }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
