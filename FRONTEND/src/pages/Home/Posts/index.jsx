import AddPost from "./AddPost";
import PostItem from "./PostItem";

const images = [
  {
    img: "https://images.unsplash.com/photo-1549388604-817d15aa0110",
    alt: "Bed",
  },
  // {
  //   img: "https://images.unsplash.com/photo-1525097487452-6278ff080c31",
  //   alt: "Books",
  // },
  // {
  //   img: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
  //   alt: "Sink",
  // },
];

const postInfo = {
  name: "Furina",
  date: "05/05/2025",
  images: images,
};

function Posts() {
  return (
    <>
      <AddPost />
      <PostItem {...postInfo} />
    </>
  );
}

export default Posts;
