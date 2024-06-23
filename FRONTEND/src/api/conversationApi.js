import axios from "~/utils/axios";

export const getConversation = async (accessToken, conversationId) => {
  try {
    const res = await axios.get("/api/conversation/messages/" + conversationId, {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return res.data;
  } catch (error) {
    console.log({ error });
    return { status: 500, message: "Internal Server Error" };
  }
};
