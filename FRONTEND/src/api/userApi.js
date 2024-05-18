// import request from "~/utils/axios";
import axiosJWT from "~/utils/axiosJWT";

export const testUser = async (accessToken) => {
  try {
    await axiosJWT.get("/api/user", {
      headers: {
        token: `Bearer ${accessToken}`,
      },
    });
    return "test";
  } catch (error) {
    console.log({ error });
  }
};
