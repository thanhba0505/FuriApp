import { loginSuccess, loginFail, logoutSuccess } from "~/redux/authSlice";
import axios from "~/utils/axios";

export const loginAccount = async (account, dispatch) => {
  try {
    const res = await axios.post("/api/account/login", account);

    if (res.data.status == 200) {
      dispatch(loginSuccess(res.data.result));
    } else {
      dispatch(loginFail());
    }
    return res.data;
  } catch (error) {
    dispatch(loginFail());
    console.log({ error });
    return { status: 500, message: "Internal Server Error" };
  }
};

export const registerAccount = async (account) => {
  try {
    const res = await axios.post("/api/account/register", account);
    return res.data;
  } catch (error) {
    console.log({ error });
    return { status: 500, message: "Internal Server Error" };
  }
};

export const logOut = async (dispatch, accessToken) => {
  try {
    const res = await axios.post(
      "/api/account/logout",
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    if (res.data.status == 200) {
      dispatch(logoutSuccess());
    }
    return res.data;
  } catch (error) {
    console.log({ error });
    return { status: 500, message: "Internal Server Error" };
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
