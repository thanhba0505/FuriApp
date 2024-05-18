import {
  loginFailed,
  loginStart,
  loginSuccess,
  logoutFailed,
  logoutStart,
  logoutSuccess,
  registerFailed,
  registerStart,
  registerSuccess,
} from "~/redux/authSlice";
import axios from "~/utils/axios";
import axiosJWT from "~/utils/axiosJWT";

export const loginAccount = async (account, dispatch, setError, setOpen) => {
  dispatch(loginStart());

  try {
    const res = await axios.post("/api/account/login", account);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    setError(error.response?.data?.message);
    setOpen(true);
    dispatch(loginFailed());
  }
};

export const registerAccount = async (
  account,
  dispatch,
  setMessage,
  setOpen
) => {
  dispatch(registerStart());

  try {
    const res = await axios.post("/api/account/register", account);
    setMessage(res.data?.message);
    setOpen(true);
    dispatch(registerSuccess());
  } catch (error) {
    setMessage(error.response?.data?.message);
    setOpen(true);
    dispatch(registerFailed());
  }
};

export const logOut = async (dispatch, accessToken) => {
  dispatch(logoutStart());
  try {
    await axiosJWT.post(
      "/api/account/logout",
      { a: "a" },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFailed());
  }
};
