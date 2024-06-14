import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextInput from "~/components/TextInput";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

import React, { useEffect, useState } from "react";
import { loginAccount } from "~/api/accountApi";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState("bocchichan");
  const [password, setPassword] = useState("passtest123");
  const [checked, setChecked] = useState(true);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    if (password === "" || username === "") {
      setDisabled(true);
    } else setDisabled(false);
  }, [password, username]);

  const dispatch = useDispatch();

  const handleLogin = async () => {
    const newAccount = { username: username, password: password };
    try {
      const res = await loginAccount(newAccount, dispatch);
      if (res.message) {
        enqueueSnackbar(res.message, {
          variant: res.status == 200 ? "success" : "error",
        });
      }
    } catch (error) {
      console.log({ error });
    }
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
    </Box>
  );
};

const LoginMemo = React.memo(Login);

export default LoginMemo;
