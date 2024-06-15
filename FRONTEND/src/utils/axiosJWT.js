import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { handleRefreshSuccess } from "~/services/authService";
import store from "~/redux/store";
import request from "~/utils/axios";

const axiosJWT = axios.create({
  baseURL: import.meta.env.VITE_FURI_API_BASE_URL,
  withCredentials: true,
});

axiosJWT.interceptors.request.use(
  async (config) => {
    const account = store.getState().auth.login.currentAccount;
    if (!account) return config;

    let date = new Date();
    const decodedToken = jwtDecode(account.accessToken);
    if (decodedToken.exp < date.getTime() / 1000) {
      try {
        const res = await request.post("/api/account/refresh");
        const refreshAccount = {
          ...account,
          accessToken: res.data.accessToken,
        };
        handleRefreshSuccess(refreshAccount);
        config.headers["token"] = `Bearer ${res.data.accessToken}`;
      } catch (error) {
        console.log({ message: "Refresh token failed", error });
        // Optionally, you can dispatch a logout action here
      }
    } else {
      config.headers["token"] = `Bearer ${account.accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default axiosJWT;
