import axios from "~/utils/axios";

export const getImage = async (folder, image) => {
  try {
    const res = await axios.get(`/api/${folder}/${image}`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(res.data);
    return url;
  } catch (error) {
    console.log({ error });
  }
};
