import axios from "~/utils/axios";

export const addStory = async (accessToken, formData) => {
  try {
    const res = await axios.post(`/api/story/add`, formData, {
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

export const getStories = async (accessToken, page, limit) => {
  try {
    const res = await axios.get(
      `/api/story/stories?_page=${page}&_limit=${limit}`,
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
