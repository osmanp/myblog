import { Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import React from "react";


const PostItem = ({ post }) => {
  return (
    <Grid container spacing={0}>
      <Grid item xs>
        <img
          src="/thumbnails/js.png"
          style={{ height: "20px", width: "20px" }}
        ></img>
      </Grid>
      <Grid item xs={6}>
        <Typography>{post.attributes.title}</Typography>
      </Grid>
      <Grid item xs>
        Badge Here
      </Grid>
    </Grid>
  );
};
PostItem.propTypes = {
  post: PropTypes.object
};
export default PostItem;
