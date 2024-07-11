import React, { useState, useRef, useCallback } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const InfiniteScrollList = ({
  items,
  loadMore,
  hasMore,
  renderItem,
  pl,
  noMore = "No more items",
}) => {
  const observer = useRef();
  const [loading, setLoading] = useState(false);

  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true);
          loadMore().finally(() => setLoading(false));
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, loadMore]
  );

  return (
    <>
      {items.map((item, index) => (
        <React.Fragment key={item._id + index}>
          {renderItem(item, items.length === index + 1 ? lastItemRef : null)}
        </React.Fragment>
      ))}

      {loading && (
        <Box textAlign={"center"} mt={2}>
          <CircularProgress />
        </Box>
      )}
      {!hasMore && (
        <Typography textAlign={"center"} pl={pl} py={2} mt={1} width={"100%"}>
          {noMore}
        </Typography>
      )}
    </>
  );
};

export default InfiniteScrollList;
