import {
  Chip,
  Container,
  Divider,
  Grid,
  Typography,
  Paper,
  useTheme,
} from "@material-ui/core";
import React from "react";
import ReactMarkdown from "react-markdown";
import CodeRenderer from "./MDComponents/CodeRenderer";
import HeadingRenderer from "./MDComponents/HeadingRenderer";

const LatestArticle = ({ attributes, body }) => {
  const theme = useTheme();
  return (
    <React.Fragment>
      <Container maxWidth="md" style={{ marginBottom: "20px" }}>
        <Paper
          elevation={4}
          style={{
            textAlign: "left",
            backgroundColor: theme.palette.background.default,
            padding: "10px",
            margin: "-10px",
          }}
        >
          <Grid
            container
            spacing={1}
            direction="column"
            alignItems="stretch"
            justify="flex-start"
          >
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
            </Grid>
            <Typography style={{ minWidth: "100%" }}>
              <Divider variant="fullWidth"></Divider>
            </Typography>
            {/* article */}
            <Grid item>
              <article>
                <div style={{ marginTop: "30px" }}>
                  <ReactMarkdown
                    source={body.slice(0, 500) + " ..."}
                    renderers={{
                      code: CodeRenderer,
                      heading: HeadingRenderer,
                    }}
                  />
                </div>
              </article>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </React.Fragment>
  );
};
export default LatestArticle;
