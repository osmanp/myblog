import React from "react";



const ListRenderer = (props) => {
  console.log(props);
  console.log(props.children[0].props);
  return (
    <>
        <p>asdasd</p>
    </>
  )
};

export default ListRenderer;
