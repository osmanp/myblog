import { Chip, Grid, Typography } from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles(() => ({
  root: {
    
    flexGrow: 1,
    marginTop:'20px',
    marginBottom:'20px',

    alignItems:'left'
  },
  card:{
      border:'1px solid',
     
  }
}));

const TagCloud = ({ posts,handleTagClick }) => {  
  const classes = useStyles();
  const tags = {};
  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];
    for (let k = 0; k < post.attributes.tags.length; k++) {
      let tag = post.attributes.tags[k];
      if (tags[tag]) {
        tags[tag]++;
      } else {
        tags[tag] = 1;
      }
    }
  }
  return (
    <div className={classes.root}>   
    <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="flex-start"
        spacing={1}        
        key={"tag"}
      >
        {Object.keys(tags).map((tag, index) => {
          return (
            
              <Grid item key={index}>
                <Chip
                  key={index}
                  label={tag + "(" + tags[tag] + ")"}
                  clickable
                  variant='default'
                  color='default'
                  onClick={() => {handleTagClick(tag)}}
                />                
              </Grid>            
          );
        })}
      </Grid>

    </div>
  );
};

export default TagCloud;
