import { createSlice } from "@reduxjs/toolkit";

const otherSlice = createSlice({
  name: "auth",
  initialState: {
    authPage: {
      page: "login",
    },
  },
  reducers: {
    setPageLogin: (state) => {
      state.authPage.page = "login";
    },
    setPageRegister: (state) => {
      state.authPage.page = "register";
    },
  },
});

export const { setPageLogin, setPageRegister } = otherSlice.actions;

export default otherSlice.reducer;
