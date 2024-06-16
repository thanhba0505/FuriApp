import {
  loginSuccess,
  loginFail,
  logoutSuccess,
  refreshSuccess,
} from "~/redux/authSlice";
import axios from "~/utils/axios";

export const loginAccount = async (account, dispatch) => {
  try {
    const res = await axios.post("/api/account/login", account);

    if (res.data.status == 200) {
      dispatch(loginSuccess(res.data.account));
    } else {
      dispatch(loginFail());
    }
    return res.data;
  } catch (error) {
    dispatch(loginFail());
    console.log({ error });
    return { status: 500, message: "Internal Server Error" };
  }
};

export const refreshAccount = async (dispatch) => {
  try {
    const res = await axios.post("/api/account/refresh");

    if (res.data.status == 200) {
      dispatch(refreshSuccess(res.data.accessToken));
      window.location.reload();
    } else {
      dispatch(loginFail());
    }
    return res.data;
  } catch (error) {
    dispatch(loginFail());
    console.log({ error });
    return { status: 500, message: "Internal Server Error" };
  }
};

export const logOut = async (dispatch, accessToken) => {
  try {
    const res = await axios.post(
      "/api/account/logout",
      {},
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    if (res.data.status == 200) {
      dispatch(logoutSuccess());
    } else {
      dispatch(loginFail());
    }
    return res.data;
  } catch (error) {
    console.log({ error });
    return { status: 500, message: "Internal Server Error" };
  }
};

export const registerAccount = async (account) => {
  try {
    const res = await axios.post("/api/account/register", account);
    return res.data;
  } catch (error) {
    console.log({ error });
    return { status: 500, message: "Internal Server Error" };
  }
};

export const getFriends = async (accessToken) => {
  try {
    const res = await axios.get("/api/account/friends", {
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

export const getNonFriends = async (accessToken, limit) => {
  try {
    const res = await axios.get("/api/account/nonfriends", {
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
    return { status: 500, message: "Internal Server Error" };
  }
};

export const getReceivedFriendRequests = async (accessToken, limit) => {
  try {
    const res = await axios.get("/api/account/received", {
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
    return { status: 500, message: "Internal Server Error" };
  }
};

export const getSentFriendRequests = async (accessToken) => {
  try {
    const res = await axios.get("/api/account/sent", {
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

export const sendFriendRequest = async (accessToken, receiverId) => {
  try {
    const res = await axios.post(
      "/api/account/friend/send",
      {
        receiverId: receiverId,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log({ error });
    return { status: 500, message: "Internal Server Error" };
  }
};

export const acceptFriendRequest = async (accessToken, senderId) => {
  try {
    const res = await axios.put(
      "/api/account/friend/accept",
      {
        senderId: senderId,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log({ error });
    return { status: 500, message: "Internal Server Error" };
  }
};

export const rejectFriendRequest = async (accessToken, senderId) => {
  try {
    const res = await axios.put(
      "/api/account/friend/reject",
      {
        senderId: senderId,
      },
      {
        headers: {
          token: `Bearer ${accessToken}`,
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log({ error });
    return { status: 500, message: "Internal Server Error" };
  }
};
