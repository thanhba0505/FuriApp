import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormPost from "./FormPost";

const ImageWithSize = React.memo(({ src, onLoad }) => {
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      const isLandscape = img.width > img.height;
      onLoad(isLandscape);
    };
  }, [src, onLoad]);

  return (
    <img
      src={src}
      alt="Post"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: 8,
      }}
    />
  );
});

ImageWithSize.displayName = "ImageWithSize";

const PostItem = ({ post }) => {
  const [layouts, setLayouts] = useState(Array(post.images?.length).fill(null));

  const handleImageLoad = (index, isLandscape) => {
    if (layouts[index] !== isLandscape) {
      const newLayouts = [...layouts];
      newLayouts[index] = isLandscape;
      setLayouts(newLayouts);
    }
  };

  const getGridTemplate = () => {
    if (layouts.length === 1) {
      return `
        "a"
      `;
    } else if (layouts.length === 2) {
      return `
        "a b"
      `;
    } else if (layouts.length === 3) {
      const [a, b, c] = layouts;

      if (a & b & c) {
        return `
          "a a"
          "b c"
        `;
      } else if (!a & b & c) {
        return `
          "a b"
          "a c"
        `;
      } else if (a & !b & c) {
        return `
          "b a"
          "b c"
        `;
      } else if (a & b & !c) {
        return `
          "c a"
          "c b"
        `;
      } else if (!a & !b & c) {
        return `
          "a b"
          "c c"
        `;
      } else if (a & !b & !c) {
        return `
          "b c"
          "a a"
        `;
      } else if (!a & b & !c) {
        return `
          "a c"
          "b b"
        `;
      } else if (!a & !b & !c) {
        return `
          "a b c"
        `;
      } else {
        return `
          "a b c"
        `;
      }
    } else if (layouts.length === 4) {
      const [a, b, c, d] = layouts;

      if (a & b & c & d) {
        return `
          "a b"
          "c d"
        `;
      } else if (!a & b & c & d) {
        return `
          "a b"
          "a c"
          "a d"
        `;
      } else if (a & !b & c & d) {
        return `
          "b a"
          "b c"
          "b d"
        `;
      } else if (a & b & !c & d) {
        return `
          "c a"
          "c b"
          "c d"
        `;
      } else if (a & b & c & !d) {
        return `
          "d a"
          "d b"
          "d c"
        `;
      } else if (!a & !b & c & d) {
        return `
          "a b c c"
          "a b d d"
        `;
      } else if (a & !b & !c & d) {
        return `
          "b c a a"
          "b c d d"
        `;
      } else if (a & b & !c & !d) {
        return `
          "c d a a"
          "c d b b"
        `;
      } else if (!a & b & c & !d) {
        return `
        "a d b b"
        "a d c c"
        `;
      } else if (!a & b & !c & d) {
        return `
        "a c b b"
        "a c d d"
        `;
      } else if (a & !b & c & !d) {
        return `
        "b d a a"
        "b d c c"
        `;
      } else if (a & !b & !c & !d) {
        return `
          "b c d"
          "a a a"
        `;
      } else if (!a & b & !c & !d) {
        return `
          "a c d"
          "b b b"
        `;
      } else if (!a & !b & c & !d) {
        return `
          "a b d"
          "c c c"
        `;
      } else if (!a & !b & !c & d) {
        return `
          "a b c"
          "d d d"
        `;
      } else if (!a & !b & !c & !d) {
        return `
          "a b c"
          "a b d"
        `;
      } else {
        return `
          "a b c d"
        `;
      }
    } else if (layouts.length >= 5) {
      const [a, b, c] = layouts;

      if (a & b & c) {
        return `
          "a b"
          "c d"
        `;
      } else if (!a & b & c) {
        return `
          "a b"
          "a c"
          "a d"
        `;
      } else if (a & !b & c) {
        return `
          "b a"
          "b c"
          "b d"
        `;
      } else if (a & b & !c) {
        return `
          "c a"
          "c b"
          "c d"
        `;
      } else if (!a & !b & c) {
        return `
          "a b c c"
          "a b d d"
        `;
      } else if (a & !b & !c) {
        return `
          "b c a a"
          "b c d d"
        `;
      } else if (!a & b & !c) {
        return `
        "a c b b"
        "a c d d"
        `;
      } else if (!a & !b & !c) {
        return `
          "a b c"
          "d d d"
        `;
      } else {
        return `
          "a b c"
        `;
      }
    } else {
      return layouts.every((isLandscape) => isLandscape !== null && isLandscape)
        ? `
          "a b c"
          "d d d"
        `
        : `
          "a a a"
          "b c d"
        `;
    }
  };

  return (
    <FormPost
      fullName={post.account.user?.fullName}
      date={post?.updatedAt}
      interact={post?.interact}
    >
      <Typography variant="body1" sx={{ mt: 2 }}>
        {post?.content}
      </Typography>
      {post.images && post.images.length > 0 && (
        <Box
          sx={{
            display: "grid",
            gridTemplateAreas: getGridTemplate(),
            gap: 2,
            mt: 2,
          }}
        >
          {post.images &&
            post.images
              .slice(0, post.images.length >= 5 ? 3 : post.images.length)
              .map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    gridArea:
                      index === 0
                        ? "a"
                        : index === 1
                        ? "b"
                        : index === 2
                        ? "c"
                        : "d",
                  }}
                >
                  <ImageWithSize
                    src={
                      import.meta.env.VITE_FURI_API_BASE_URL +
                      "/api/image/imagepost/" +
                      image
                    }
                    onLoad={(isLandscape) =>
                      handleImageLoad(index, isLandscape)
                    }
                  />
                </Box>
              ))}

          {post.images.length >= 5 && (
            <Box
              sx={{
                gridArea: "d",
                paddingBottom: "100%",
                position: "relative",
              }}
            >
              <img
                src={
                  import.meta.env.VITE_FURI_API_BASE_URL +
                  "/api/image/imagepost/" +
                  post.images[4]
                }
                alt="Post"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: blur("5px"),
                  borderRadius: 8,
                }}
              />
              <div
                style={{
                  borderRadius: 8,
                  userSelect: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  color: "white",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                }}
              >
                +{post.images.length - 3}
              </div>
            </Box>
          )}
        </Box>
      )}
    </FormPost>
  );
};

export default PostItem;
