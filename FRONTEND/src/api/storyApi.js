import axios from "~/utils/axios";

export const addStory = async (accessToken, formData) => {
  try {
    const res = await axios.post(`/api/story`, formData, {
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

export const getStories = async (accessToken, limit) => {
  try {
    const res = await axios.get(
      `/api/story?_limit=${limit}`,
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
