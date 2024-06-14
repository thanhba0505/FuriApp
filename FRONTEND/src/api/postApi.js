import axiosJWT from "~/utils/axiosJWT";

export const getPosts = async (accessToken, page, limit) => {
  try {
    const res = await axiosJWT.get(
      `/api/post/posts?_page=${page}&_limit=${limit}`,
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );

    return res;
  } catch (error) {
    console.log({ error });
  }
};

export const getInteract = async (accessToken, postID, type) => {
  try {
    const res = await axiosJWT.post(
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
    const res = await axiosJWT.post(
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
    const res = await axiosJWT.post(`/api/post/add`, formData, {
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
