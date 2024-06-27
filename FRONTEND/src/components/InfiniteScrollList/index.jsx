import React, { useState, useRef, useEffect, useCallback } from "react";
import { CircularProgress, Box, Typography } from "@mui/material";

const InfiniteScrollList = ({ items, loadMore, hasMore, renderItem }) => {
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
      {items.map((item, index) => {
        if (items.length === index + 1) {
          return (
            <React.Fragment key={item._id + index}>
              {renderItem(item, lastItemRef)}
            </React.Fragment>
          );
        } else {
          return <React.Fragment key={item._id + index}>{renderItem(item)}</React.Fragment>;
        }
      })}

      {loading && (
        <Box textAlign={"center"} mt={2}>
          <CircularProgress />
        </Box>
      )}
      {!hasMore && (
        <Typography textAlign={"center"} py={2} width={"100%"}>
          No more items
        </Typography>
      )}
    </>
  );
};

export default InfiniteScrollList;
