/* eslint-disable react-refresh/only-export-components */
import { Button } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import { memo, useState } from "react";
import { useSelector } from "react-redux";
import { getPosts, getPostsByAccountId } from "~/api/postApi";
import ImageUploadDialog from "~/components/ImageUploadDialog";
import Paper from "~/components/Paper";
import PostListMemo from "~/components/PostList";

function Video() {
  const account = useSelector((state) => state.auth?.login?.currentAccount);
  const accessToken = account?.accessToken;
  const limit = 6;

  return (
    <>
      <PostListMemo
        accessToken={accessToken}
        limit={limit}
        // accountId={"66619618a5fada55fe35daa6"}
      />
    </>
  );
}

export default memo(Video);
