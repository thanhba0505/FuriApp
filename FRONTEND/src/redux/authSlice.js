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
      state.login.currentAccount = action.payload;
    },

    refreshSuccess: (state, action) => {
      state.login.currentAccount = action.payload;
    },

    loginFail: (state) => {
      state.login.currentAccount = null;
    },

    logoutSuccess: (state) => {
      state.login.currentAccount = null;
    },
  },
});

export const { loginSuccess, loginFail, refreshSuccess, logoutSuccess } =
  authSlice.actions;

export default authSlice.reducer;
