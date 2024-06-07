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

    logoutSuccess: (state) => {
      state.login.currentAccount = null;
    },
  },
});

export const {
  loginSuccess,
  logoutSuccess,
} = authSlice.actions;

export default authSlice.reducer;
