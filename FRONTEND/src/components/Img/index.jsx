function Img({ src, alt, br, maxh }) {
  return (
    <img
      src={src}
      alt={alt}
      width="100%"
      //   height="100%"
      style={{ borderRadius: br, objectFit: "cover", maxHeight: maxh }}
    />
  );
}

export default Img;
