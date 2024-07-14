import Box from "@mui/material/Box";

import TextInput from "~/components/TextInput";

import React, { useEffect, useState } from "react";
import { registerAccount } from "~/api/accountApi";
import { enqueueSnackbar } from "notistack";
import { LoadingButton } from "@mui/lab";
import { CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { setPageLogin } from "~/redux/otherSlice";

const Register = () => {
  const dispatch = useDispatch();

  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [samePassword, setSamePassword] = useState(true);
  const [disabled, setDisabled] = useState(true);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const samePassword = password === confirmPassword;
    if (confirmPassword !== "") setSamePassword(samePassword);

    setDisabled(
      username == "" ||
        fullname == "" ||
        password == "" ||
        confirmPassword == "" ||
        !samePassword
    );
  }, [password, confirmPassword, username, fullname, samePassword]);

  const handleRegister = async () => {
    const newAccount = {
      username: username,
      password: password,
      fullname: fullname,
    };

    try {
      setLoading(true);
      const res = await registerAccount(newAccount);

      if (res.status == 200) {
        setUsername("");
        setFullname("");
        setPassword("");
        setConfirmPassword("");
      }

      enqueueSnackbar(res.message, {
        variant: res.status == 200 ? "success" : "error",
      });

      setLoading(false);

      dispatch(setPageLogin);
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      // justifyContent={"center"}
    >
      <TextInput
        label="Full Name"
        type="text"
        placeholder="Furi"
        value={fullname}
        onChange={(e) => setFullname(e.target.value)}
      />

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

      <TextInput
        label="Confirm password"
        type="password"
        placeholder="furi123#$%^&"
        textError={samePassword ? "" : "Confirm password does not match"}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <Box flexGrow={1} alignContent={"end"}>
        <LoadingButton
          variant="contained"
          sx={{ height: "56px", width: "100%", mt: 2, mb: 1 }}
          onClick={!disabled ? handleRegister : null}
          disabled={disabled}
          loading={loading}
          loadingIndicator={<CircularProgress color="primary" size={24} />}
        >
          Register
        </LoadingButton>
      </Box>
    </Box>
  );
};

const RegisterMemo = React.memo(Register);

export default RegisterMemo;
