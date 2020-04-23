import {
  Container,
  Grid,
  Chip,
  Typography,
  Card,
  Divider,
  useTheme,
} from "@material-ui/core";
import React from "react";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import CodeRenderer from "../../components/MDComponents/CodeRenderer";
import HeadingRenderer from "../../components/MDComponents/HeadingRenderer";
import BlogPost from "../../data/blog-posts";
import ImageRenderer from "../../components/MDComponents/ImageRenderer";
import ListRenderer from "../../components/MDComponents/ListRenderer";

const Page = ({ attributes, body, ...props }) => {
  const newProps = { attributes, body, ...props };
  return (
    <React.Fragment>
      <Layout {...newProps}>
        <Card>
          <Container maxWidth="md" style={{ marginBottom: "200px" }}>
            <Grid container spacing={1} direction="column" alignItems="stretch">
              {/* Header */}

              <Grid item>
                <Grid container direction="row" alignItems="flex-start">
                  <Grid item xs={9}>
                    <Grid
                      container
                      spacing={1}
                      direction="column"
                      alignItems="stretch"
                    >
                      <Grid item>
                        <Typography
                          variant="h2"
                          component="h2"
                          style={{
                            fontSize: "42px",
                            fontFamily:
                              "Roboto,-apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif",
                            lineHeight: 1.3,
                            marginTop: "20px",
                          }}
                        >
                          {attributes.title}
                        </Typography>

                        <Typography
                          variant="subtitle1"
                          component="subtitle1"
                          noWrap
                        >
                          {new Date(attributes.date).toDateString()}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justify="flex-start"
                          spacing={2}
                        >
                          {attributes.tags.map((element, index) => {
                            return (
                              <Grid item key={index}>
                                <Chip label={element}></Chip>
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={3}>
                    <img
                      src={attributes.thumbnail}
                      alt={attributes.title}
                      style={{
                        maxHeight: "%60",
                        maxWidth: "%60",
                        marginTop: "20px",
                      }}
                    />
                  </Grid>
                </Grid>
                <Grid item>
                  <Typography style={{ minWidth: "100%", marginTop: "10px" }}>
                    <Divider variant="fullWidth"></Divider>
                  </Typography>
                </Grid>
              </Grid>

              {/* article */}
              <Grid item>
                <article>
                  <div style={{ marginTop: "30px" }}>
                    <ReactMarkdown
                      source={body}
                      renderers={{
                        code: CodeRenderer,
                        heading: HeadingRenderer,
                        imageReference: ImageRenderer,
                        image: ImageRenderer,
                      }}
                    />
                  </div>
                </article>
              </Grid>
            </Grid>
          </Container>
        </Card>
      </Layout>
    </React.Fragment>
  );
};

export async function getStaticProps(context) {
  let post = BlogPost.find((a) => a.attributes.slug == context.params.slug);
  return {
    props: {
      attributes: post.attributes,
      body: post.body      
    },
  };
}

export async function getStaticPaths() {
  // create paths with `slug` param
  const paths = BlogPost.map((post) => `/article/${post.attributes.slug}`);
  return {
    paths,
    fallback: false,
  };
}
export default Page;
