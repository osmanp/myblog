import React from "react";



const ImageRenderer = (props) => {
  
  //console.log(props.children[0].props);
  return (
    <>
    <img src={props.src} style={{maxWidth:'992px'}}></img>
    </>
  )
};

export default ImageRenderer;
