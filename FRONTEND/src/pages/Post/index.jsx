/* eslint-disable react-refresh/only-export-components */
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPostById } from "~/api/postApi";
import PostItemMemo from "~/components/PostItem";

const Post = () => {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;

  const { postId } = useParams();

  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await getPostById(accessToken, postId);
        console.log(res);

        if (res.status == 200) {
          setPost(res.post);
        } else {
          console.log({ res });
        }
      } catch (error) {
        console.log({ error });
      }
    };

    if ((accessToken, postId)) {
      fetchApi();
    }
  }, [accessToken, postId]);

  return <>{post ? <PostItemMemo post={post} /> : ""}</>;
};

export default memo(Post);
