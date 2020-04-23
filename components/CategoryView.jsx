import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Chip, Card, Grid } from "@material-ui/core";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

const useStyles = makeStyles((theme) => ({
  root: {
   
    flexGrow: 1,
    maxWidth: '200px',
    alignItems:'left'
  },
  tree:{
    height: 240,
    flexGrow: 1,
    maxWidth: 400
  },
  card: {
    border: "1px solid"
  },
}));

const CategoryView = ({ posts }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const categories = [];
  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];
    categories.push(post.attributes.categories);
  }
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <TreeView
          className={classes.tree}
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
        >
          <TreeItem nodeId="1" label="Coding">
            <TreeItem nodeId="2" label="Javascript" />
            <TreeItem nodeId="3" label="C#" />
            <TreeItem nodeId="4" label="C++" />
          </TreeItem>
          <TreeItem nodeId="5" label="Devops">
            <TreeItem nodeId="10" label="RabbitMQ" />
            <TreeItem nodeId="6" label="PostgreSQL"/>                          
          </TreeItem>
          <TreeItem nodeId="8" label="Algorithms">
            <TreeItem nodeId="11" label="MinMax" />                                      
          </TreeItem>
        </TreeView>
      </Card>
    </div>
  );
};

export default CategoryView;
