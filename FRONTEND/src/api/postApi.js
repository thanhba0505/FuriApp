// import { getPostFailed, getPostStart, getPostSuccess } from "~/redux/postSlice";
import axios from "~/utils/axios";

export const getPosts = async (accessToken, limit) => {
  try {
    const res = await axios.get(`/api/post/posts?_limit=${limit}`, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });

    console.log(res);
    return res;
  } catch (error) {
    console.log({ error });
  }
};
