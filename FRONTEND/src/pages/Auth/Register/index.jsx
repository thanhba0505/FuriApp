import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import TextInput from "~/components/TextInput";

import { useEffect, useState } from "react";
import { registerAccount } from "~/api/accountApi";
import { useDispatch } from "react-redux";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function Register() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);

  const [samePassword, setSamePassword] = useState(true);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const samePassword = password === confirmPassword;
    if (confirmPassword !== "") setSamePassword(samePassword);

    setDisabled(
      username == "" ||
        fullName == "" ||
        password == "" ||
        confirmPassword == "" ||
        !samePassword
    );
  }, [password, confirmPassword, username, fullName, samePassword]);

  const dispatch = useDispatch();

  const handleRegister = () => {
    const newAccount = {
      username: username,
      password: password,
      fullName: fullName,
    };

    registerAccount(newAccount, dispatch, setMessage, setOpen);
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
        label="Full Name"
        type="text"
        placeholder="Furi"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
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

      <Button
        variant="contained"
        sx={{ height: "56px", width: "100%", mt: 2, mb: 1 }}
        onClick={!disabled ? handleRegister : null}
        disabled={disabled}
      >
        Register
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
          severity={message == "Registration successful" ? "info" : "error"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Register;
