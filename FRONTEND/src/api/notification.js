import axios from "~/utils/axios";

export const getNotify = async (accessToken, limit) => {
  try {
    const res = await axios.get(`/api/notify/notifications`, {
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
