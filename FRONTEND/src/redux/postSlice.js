import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    getPost: {
      isFetching: false,
      error: false,
    },
  },
  reducers: {
    getPostStart: (state) => {
      state.getPost.isFetching = true;
      state.getPost.error = false;
    },
    getPostSuccess: (state) => {
      state.getPost.isFetching = false;
      state.getPost.error = false;
    },
    getPostFailed: (state) => {
      state.getPost.isFetching = false;
      state.getPost.error = true;
    },
  },
});

export const { getPostStart, getPostSuccess, getPostFailed } =
  postSlice.actions;

export default postSlice.reducer;
