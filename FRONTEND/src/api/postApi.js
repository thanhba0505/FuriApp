// import { getPostFailed, getPostStart, getPostSuccess } from "~/redux/postSlice";
import axios from "~/utils/axios";

export const getPosts = async (accessToken, limit) => {
  try {
    const res = await axios.get(`/api/post/posts?_limit=${limit}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });

    return res;
  } catch (error) {
    console.log({ error });
  }
};

export const getInteract = async (accessToken, postID, type) => {
  try {
    const res = await axios.post(
      `/api/post/interact/${postID}`,
      {
        type: type ? type : null,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const addComment = async (accessToken, postID, content) => {
  try {
    const res = await axios.post(
      `/api/post/addcomment/${postID}`,
      {
        content: content,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );

    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const addPost = async (accessToken, formData) => {
  try {
    const res = await axios.post(`/api/post/add`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.log({ error });
  }
};
