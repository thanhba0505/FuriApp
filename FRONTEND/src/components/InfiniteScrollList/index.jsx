import React, { useState, useRef, useCallback } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const InfiniteScrollList = ({
  items,
  loadMore,
  hasMore,
  renderItem,
  LoadingComponent,
  NoMoreComponent,
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

      {loading &&
        (LoadingComponent ? (
          <LoadingComponent />
        ) : (
          <Box textAlign={"center"}>
            <CircularProgress />
          </Box>
        ))}

      {!hasMore &&
        (NoMoreComponent ? (
          <NoMoreComponent />
        ) : (
          <Typography textAlign={"center"} width={"100%"}>
            No more items
          </Typography>
        ))}
    </>
  );
};

export default InfiniteScrollList;
