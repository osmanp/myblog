import {
  Container,
  Grid,
  makeStyles,
  useTheme,
  Typography,
} from "@material-ui/core";
import React from "react";
import Layout from "../components/Layout";
import PostGridList from "../components/PostGridList";
import TagCloud from "../components/TagCloud";
import SearchBox from "../components/SearchBox";
import PostList from "../data/blog-posts";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100%",
    overflow: "auto",
    flexGrow: 1,
  },
  flexColScroll: {
    flexGrow: 1,
    overflow: "auto",
    minHeight: "%100",
  },
  flexNoShrink: {
    flexShrink: 0,
  },
  flexSection: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "0",
  },
}));

const Articles = (props) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const [postList, setPostList] = React.useState(PostList);
  const handleTagClick = (tag) => {
    let newPostList = postList.filter(
      (post) => post.attributes.tags.indexOf(tag) > -1
    );
    setPostList(newPostList);
  };
  const onSearch = (text) => {
    let newPostList = postList.filter((post) =>
      post.attributes.title.toLowerCase().includes(text)
    );
    setPostList(newPostList);
  };
  const onReset = () => {
    window.location.reload();
  }
  return (
    <React.Fragment>
     <Layout {...props}>
        <div className={classes.paper}>
          <Container maxWidth="md" style={{ marginBottom: "200px" }}>
            <Grid container spacing={2} direction="column" alignItems="stretch">
              <Grid item></Grid>
              <Grid
                container
                item
                direction="column"
                alignItems="stretch"
                justify="flex-start"
              >
                <Grid
                  container
                  item
                  direction="row"
                  spacing={3}
                  alignItems="flex-start"
                >
                  <Grid item xs={4}>
                    <Typography
                      component="h5"
                      variant="h5"
                      noWrap
                      align="left"
                      color="primary"
                    >
                      {""}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <TagCloud
                    posts={postList}
                    handleTagClick={handleTagClick}
                  ></TagCloud>
                </Grid>
              </Grid>
              <Grid
                container
                item
                direction="column"
                alignItems="stretch"
                justify="flex-start"
              >
                <Grid
                  container
                  item
                  direction="row"
                  spacing={3}
                  alignItems="flex-start"
                >
                  <Grid item xs={4}>
                    <Typography
                      component="h5"
                      variant="h5"
                      noWrap
                      align="left"
                      color="primary"
                    >
                      {""}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item>
                  <SearchBox onSearch={onSearch} onReset={onReset}></SearchBox>
                </Grid>
              </Grid>
              <Grid item>
                <PostGridList
                  postList={postList}
                  title={"All Articles"}
                  size={"Big"}
                ></PostGridList>
              </Grid>
            </Grid>
          </Container>
        </div>
      </Layout>
    </React.Fragment>
  );
};
export default Articles;
