import { loginSuccess, loginFail, logoutSuccess } from "~/redux/authSlice";
import axios from "~/utils/axios";
import axiosJWT from "~/utils/axiosJWT";

export const loginAccount = async (account, dispatch, setError, setOpen) => {
  try {
    const res = await axios.post("/api/account/login", account);
    dispatch(loginSuccess(res.data));
  } catch (error) {
    setError(error.response?.data?.message);
    setOpen(true);
    dispatch(loginFail());
  }
};

export const registerAccount = async (account, setMessage, setOpen) => {
  try {
    const res = await axios.post("/api/account/register", account);
    setMessage(res.data?.message);
    setOpen(true);
  } catch (error) {
    setMessage(error.response?.data?.message);
    setOpen(true);
  }
};

export const logOut = async (dispatch, accessToken) => {
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
    console.log({ error });
  }
};
