import Story from "./Story";
import Posts from "./Posts";
import React from "react";

function Home() {
  return (
    <>
      {/* <Story />
      <Posts /> */}
    </>
  );
}

const HomeMemo = React.memo(Home)

export default HomeMemo;
