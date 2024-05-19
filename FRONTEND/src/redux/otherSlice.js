import { createSlice } from "@reduxjs/toolkit";

const otherSlice = createSlice({
  name: "other",
  initialState: {
    app: {
      logo: import.meta.env.VITE_FURI_API_BASE_URL + "/public/app/logo-furi.png",
    },
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
