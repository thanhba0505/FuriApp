import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    login: {
      currentAccount: null,
    },
  },
  reducers: {
    loginSuccess: (state, action) => {
      console.log("loginSuccess");
      state.login.currentAccount = action.payload;
    },

    refreshSuccess: (state, action) => {
      console.log("refreshSuccess");
      const newAccessToken = action.payload;
      const account = state.login.currentAccount;
      if (account) {
        // eslint-disable-next-line no-unused-vars
        const { accessToken, ...others } = account;
        state.login.currentAccount = { ...others, accessToken: newAccessToken };
      }
    },

    loginFail: (state) => {
      console.log("loginFail");
      state.login.currentAccount = null;
    },

    logoutSuccess: (state) => {
      console.log("logoutSuccess");
      state.login.currentAccount = null;
    },

    setAvatar: (state, action) => {
      console.log("setAvatar");
      state.login.currentAccount.avatar = action.payload;
    },
  },
});

export const {
  loginSuccess,
  loginFail,
  refreshSuccess,
  logoutSuccess,
  setAvatar,
} = authSlice.actions;

export default authSlice.reducer;
