import { Button, Container, Grid, makeStyles, Typography, useTheme } from "@material-ui/core";
import React from "react";
import Layout from "../components/Layout";
import PostGridList from "../components/PostGridList";
import Quote from "../components/Quote";
import PostList from "../data/blog-posts";
import moment from 'moment';
import LatestArticle from '../components/LatestArticle';
import {useRouter} from 'next/router'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
 textAlign:'center',
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

const Index = (props) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  const router = useRouter();
  const latestArticle= PostList.sort((x,y) => moment(x.attributes.date).isBefore(y.attributes.date) ? 1 : -1)[0];  
  const handleItemClick = (post) => {
    let href = `${post.slug}`;
    router.push("/article/" + href);
  };
  return (
    <React.Fragment>
      <Layout {...props}>
        <div className={classes.paper}>
          <Container maxWidth="md" style={{ marginBottom: "200px" }}>
            <Grid container spacing={1} direction="column" alignItems="stretch">
              <Grid item >
                <Quote></Quote>
              </Grid>
              <Grid item >
              <Typography
              color='primary'
                      variant="h3"
                      component="h3"
                      style={{
                        fontSize: "42px",
                        textAlign:'left',
                        paddingLeft:'20px',
                        fontFamily:
                          "Roboto,-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif",
                        lineHeight: 1.3,
                        marginTop: "20px",
                      }}
                    >
                      Latest Article
                    </Typography>
              </Grid>
              <Grid item >
                <LatestArticle attributes={latestArticle.attributes}
                body={latestArticle.body}
                ></LatestArticle>
               <Grid item style={{alignContent:'right',textAlign:'right',paddingRight:'20px'}}>
               <Button variant='outlined' color='primary' 
                onClick={() => handleItemClick(latestArticle.attributes)}>
                  Continue Reading...
                </Button>
               </Grid>
               
                
              </Grid>
              {/* <Grid item container >
                <Grid item xs={6}>
                  <TagCloud posts={BlogPost}></TagCloud>
                </Grid>
                <Grid item xs={6}>
                  <CategoryView posts={BlogPost}></CategoryView>
                </Grid>
              </Grid> */}

              <Grid item >
                <PostGridList
                  postList={PostList.sort((x,y) => moment(x.attributes.date).isAfter(y.attributes.date)).slice(0,10)}
                  title={"Popular articles"}
                ></PostGridList>
              </Grid>
              <Grid item >
                <PostGridList
                    postList={PostList.sort((x,y) => moment(x.attributes.date).isBefore(y.attributes.date)).slice(0,10)}
                  title={"Featured articles"}
                ></PostGridList>
              </Grid>
              <Grid item >
              <Typography
        component="h4"
        variant="h4"
        noWrap
        align="left"
        color="primary"
      >
        {"Useful Links"}
      </Typography>
              </Grid>
            </Grid>
          </Container>
        </div>
      </Layout>
    </React.Fragment>
  );
};
export default Index;
