import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { loginSuccess } from "~/redux/authSlice";
import store from "~/redux/store";
import request from "~/utils/axios";

const axiosJWT = axios.create({
  baseURL: "http://localhost:5174/",
  withCredentials: true,
});

axiosJWT.interceptors.request.use(
  async (config) => {
    const account = store.getState().auth.login.currentAccount;
    if (!account) return config;

    let date = new Date();
    const decodedToken = jwtDecode(account.accessToken);
    if (decodedToken.exp < date.getTime() / 1000) {
      const data = await refreshToken();
      const refreshAccount = {
        ...account,
        accessToken: data.accessToken,
      };
      store.dispatch(loginSuccess(refreshAccount));
      config.headers["token"] = `Bearer ${data.accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

const refreshToken = async () => {
  try {
    const res = await request.post("/api/account/refresh");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export default axiosJWT;
