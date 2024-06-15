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
      
      if (!res.data.status) {
        const url = URL.createObjectURL(res.data);
        return url;
      } else {
        return { status: 500, message: "Internal Server Error" };
      }
    }
    return null;
  } catch (error) {
    console.log({ error });
  }
};
