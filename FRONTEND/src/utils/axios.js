import axios from "axios";

const request = axios.create({
  baseURL: "http://localhost:5174/",
  withCredentials: true,
});

// export const get = async (path, options = {}) => {
//   const res = await request.get(path, options);
//   return res;
// };

// export const post = async (path, options = {}) => {
//   const res = await request.post(path, options);
//   return res;
// };

export default request;
