import axiosJWT from "~/utils/axiosJWT";

export const addStory = async (accessToken, formData) => {
  try {
    const res = await axiosJWT.post(`/api/story/add`, formData, {
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
    const res = await axiosJWT.get(
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
