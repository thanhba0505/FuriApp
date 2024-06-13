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

export const registerAccount = async (account) => {
  console.log(account);
  try {
    const res = await axios.post("/api/account/register", account);
    console.log(res);
    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const logOut = async (dispatch, accessToken) => {
  try {
    await axiosJWT.post(
      "/api/account/logout",
      { logout: "logout" },
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

export const getFriends = async (accessToken) => {
  try {
    await axios.post("/api/account/friends", {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.log({ error });
  }
};
