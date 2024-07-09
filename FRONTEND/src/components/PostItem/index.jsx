/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormPost from "./FormPost";
import { useParams } from "react-router-dom";
import Slider from "react-slick";

const ImageWithSize = React.memo(({ image, onLoad }) => {
  useEffect(() => {
    if (image) {
      const newImg = new Image();
      newImg.src = image;
      newImg.onload = () => {
        const isLandscape = newImg.width > newImg.height;
        onLoad(isLandscape);
      };
    }
  }, [image, onLoad]);

  return (
    <img
      src={image}
      alt="image post"
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        borderRadius: 8,
      }}
    />
  );
});

const PostItem = ({ post, lastItemRef }) => {
  const [layouts, setLayouts] = useState(
    Array(post?.images?.length).fill(null)
  );
  const images = post?.images;

  const { postId } = useParams();

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

  const settings = {
    customPaging: function (i) {
      return (
        <a>
          <img
            src={images[i]}
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 8,
              transition: "scale .2s ease",
            }}
          />
        </a>
      );
    },

    dots: true,
    dotsClass: "slick-dots slick-thumb",
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <Box ref={lastItemRef ? lastItemRef : null}>
      <FormPost post={post}>
        <Typography variant="body1" sx={{ mt: 2 }}>
          {post?.content}
        </Typography>

        {!postId && images && images.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateAreas: getGridTemplate(),
              gap: 2,
              mt: 2,
            }}
          >
            {images
              .slice(0, images.length >= 5 ? 3 : images.length)
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
                    image={image}
                    onLoad={(isLandscape) =>
                      handleImageLoad(index, isLandscape)
                    }
                  />
                </Box>
              ))}

            {images.length >= 5 && (
              <Box
                sx={{
                  gridArea: "d",
                  paddingBottom: "100%",
                  position: "relative",
                }}
              >
                <img
                  src={images[4]}
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
                  +{images.length - 3}
                </div>
              </Box>
            )}
          </Box>
        )}

        {postId && images && (
          <Box
            mt={2}
            sx={{
              "& .slick-dots": {
                mr: -3,
                position: "relative",
                "& li": {
                  width: "50",
                  ml: 1,
                  mr: 5,
                },
                "& img": {
                  "&:hover": {
                    scale: "1.1",
                  },
                },
              },
              "& .slick-active": {
                "& img": {
                  scale: "1.1",
                  border: "2px solid",
                  borderColor: "primary.main",
                },
              },
            }}
          >
            <Slider {...settings}>
              {images &&
                images.map((image) => (
                  <Box key={image}>
                    <img
                      src={image}
                      alt="image post"
                      style={{
                        width: "100%",
                        height: 400,
                        maxHeight: 400,
                        objectFit: "contain",
                        borderRadius: 8,
                      }}
                    />
                  </Box>
                ))}
            </Slider>
          </Box>
        )}
      </FormPost>
    </Box>
  );
};

const PostItemMemo = React.memo(PostItem);

export default PostItemMemo;
