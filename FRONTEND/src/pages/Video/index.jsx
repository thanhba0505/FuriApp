import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getImageBlob } from "~/api/imageApi";
// import { testUser } from "~/api/userApi";
import Paper from "~/components/Paper";

function Video() {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const avatar = account?.avatar;
  const [img, setImg] = useState();

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const result = await getImageBlob(accessToken, avatar);
        setImg(result);
      } catch (error) {
        console.log({ error });
      }
    };
    if (avatar && accessToken) {
      fetchImage();
    }
  }, [avatar, accessToken]);

  return (
    <>
      <Paper>
        <Avatar src={img || ""} />
      </Paper>
    </>
  );
}

export default Video;
