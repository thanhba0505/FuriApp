import { jwtDecode } from "jwt-decode";
import {
  loginSuccess,
  refreshSuccess,
  setRefreshTokenTimer,
} from "~/redux/authSlice";
import store from "~/redux/store";
import request from "~/utils/axios";

const setRefreshTokenTimeout = (account) => {
  const decodedToken = jwtDecode(account.accessToken);
  const expiryTime = decodedToken.exp * 1000 - Date.now() - 60000; // 1 minute before expiration

  const timerId = setTimeout(async () => {
    try {
      const res = await request.post("/api/account/refresh");
      const newAccount = { ...account, accessToken: res.data.accessToken };
      store.dispatch(refreshSuccess(newAccount));
      setRefreshTokenTimeout(newAccount);
    } catch (error) {
      console.log({ message: "Failed to refresh token", error });
    }
  }, expiryTime);

  store.dispatch(setRefreshTokenTimer(timerId));
};

export const handleLoginSuccess = (account) => {
  store.dispatch(loginSuccess(account));
  setRefreshTokenTimeout(account);
};

export const handleRefreshSuccess = (account) => {
  store.dispatch(refreshSuccess(account));
  setRefreshTokenTimeout(account);
};
