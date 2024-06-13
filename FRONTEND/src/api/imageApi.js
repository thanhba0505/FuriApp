import axios from "~/utils/axios";

export const getImageBlob = async (accessToken, path) => {
  try {
    if (path) {
      const res = await axios.get(`/api/image/${path}`, {
        responseType: "blob",
        headers: {
          token: `Bearer ${accessToken}`,
        },
      });
      const url = URL.createObjectURL(res.data);
      return url;
    }
    return null;
  } catch (error) {
    console.log({ error });
    return null;
  }
};
