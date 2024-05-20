import {
  getImageFailed,
  getImageStart,
  getImageSuccess,
} from "~/redux/imageSlice";
import axios from "~/utils/axios";

export const getImage = async (dispatch, image) => {

  dispatch(getImageStart());

  try {
    const res = await axios.get("/api/image/" + image, { responseType: 'blob' });
    const url = URL.createObjectURL(res.data);
    dispatch(getImageSuccess());
    return url;
  } catch (error) {
    dispatch(getImageFailed());
  }
};
