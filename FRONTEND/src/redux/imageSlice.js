import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
  name: "image",
  initialState: {
    getImage: {
      url: null,
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getImageStart: (state) => {
      state.getImage.isFetching = true;
      state.getImage.error = false;
    },
    getImageSuccess: (state, action) => {
      state.getImage.isFetching = false;
      state.getImage.error = false;
      state.getImage.url = action.payload;
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
