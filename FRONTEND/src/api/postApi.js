import axios from "~/utils/axios";

export const getPosts = async (accessToken, limit) => {
  try {
    const res = await axios.get(`/api/post/posts?_limit=${limit}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const getPostsByAccountId = async (accessToken, limit, accountId) => {
  try {
    const res = await axios.get("/api/post/account/" + accountId, {
      params: {
        _limit: limit,
      },
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const getPostById = async (accessToken, postId) => {
  try {
    const res = await axios.get("/api/post/" + postId, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });

    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const getInteract = async (accessToken, postID, type) => {
  try {
    const res = await axios.post(
      `/api/post/${postID}/interaction`,
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
      `/api/post/${postID}/comment`,
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
    const res = await axios.post(`/api/post`, formData, {
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
