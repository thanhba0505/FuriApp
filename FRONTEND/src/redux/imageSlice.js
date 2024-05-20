import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "image",
  initialState: {
    getImage: {
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getImageStart: (state) => {
      state.getImage.isFetching = true;
      state.getImage.error = false;
    },
    getImageSuccess: (state) => {
      state.getImage.isFetching = false;
      state.getImage.error = false;
    },
    getImageFailed: (state) => {
      state.getImage.isFetching = false;
      state.getImage.error = true;
    },
  },
});

export const { getImageStart, getImageSuccess, getImageFailed } =
  imageSlice.actions;

export default imageSlice.reducer;
