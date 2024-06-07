import axios from "~/utils/axios";

export const getImageBlob = async (accessToken, path) => {
  try {
    const res = await axios.get(`/api/image/${path}`, {
      responseType: "blob",
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    const url = URL.createObjectURL(res.data);
    return url;
  } catch (error) {
    console.log({ error });
    return null;
  }
};

