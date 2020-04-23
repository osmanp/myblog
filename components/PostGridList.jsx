import { Avatar, List, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FiberNewIcon from "@material-ui/icons/FiberNew";
import moment from "moment";
import { useRouter } from "next/router";
import React from "react";

const useStyles = makeStyles((theme) => ({
  root: {},
  gridList: {
    width: "%60",
    height: "%100",
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)",
  },
}));

const PostGridList = ({ title, postList, size }) => {
  const router = useRouter();
  const classes = useStyles();
  const handleItemClick = (post) => {
    let href = `${post.slug}`;
    router.push("/article/" + href);
  };
  return (
    <div className={classes.root}>
      <Typography
        component="h4"
        variant="h4"
        noWrap
        align="left"
        color="primary"
      >
        {title}
      </Typography>
      <List component="ul">
        {postList.map((post, index) => {          
          return (
            <React.Fragment key={index}>
              <ListItem
                button
                divider={true}
                key={index}
                onClick={() => handleItemClick(post.attributes)}
              >
                <ListItemAvatar>
                  <Avatar
                    src={post.attributes.thumbnail}
                    alt={post.attributes.title}
                    variant='square'                    
                  />
                </ListItemAvatar>
                {size !== "Big" ? (
                  <ListItemText variant="caption" color='primary'>
                    {post.attributes.title}
                  </ListItemText>
                ) : (
                  
                    <ListItemText variant="caption" color='primary'>
                    {post.attributes.title}                  
                    </ListItemText>
                )}
                {moment(post.attributes.date).month() < 9 ? (
                  <ListItemIcon>
                    <FiberNewIcon />
                  </ListItemIcon>
                ) : null}
              </ListItem>
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
};

export default PostGridList;
