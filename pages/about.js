import { Container, CssBaseline, Typography, Grid } from "@material-ui/core";
import React from "react";
import Layout from "../components/Layout";
import ResumeViewer from "../components/ResumeViewer";
import styles from "../styles/links.scss";

const linkItem = (text, src) => (
  <>
    <a href={src} className={styles.link}>
      {text}
    </a>
  </>
);

const About = (props) => {
  return (
    <React.Fragment>
      <CssBaseline />
      <Layout {...props}>
        <Container
          maxWidth="md"
          style={{ marginBottom: "200px", marginTop: "40px" }}
        >
          <Grid
            container
            spacing={1}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item container direction="row"></Grid>
            <Grid item>
              <img src="/photos/about.jpeg" width="600px"></img>
            </Grid>
            <Grid item>
              <Typography
                variant="h4"
                style={{
                  fontFamily: "Consolas",
                }}
                color='primary'
              >
                About Me
              </Typography>
              <Typography
                variant="body1"
                style={{
                  fontFamily: "Consolas",
                }}
                color='primary'
              >
                <p>
                  Hi Everyone, I am Osman Paşalak. Currently, living in{" "}
                  {linkItem("İstanbul", "https://www.wikiwand.com/en/Istanbul")}
                  , {linkItem("Turkey", "https://www.wikiwand.com/en/Turkey")}{" "}
                  with my{" "}
                  {linkItem(
                    "lovely wife",
                    "https://www.facebook.com/seymainciser.ozcan"
                  )}{" "}
                  and{" "}
                  {linkItem(
                    "two cats",
                    "https://www.wikiwand.com/en/Bicolor_cat"
                  )}
                  .<b></b>I am a full time software developer who likes coding,
                  reading, writing, cooking, traveling, gaming and many more
                  things. My journey in software started before my college
                  years, in high school as a hobbyist{" "}
                  {linkItem(
                    "Pascal",
                    "https://www.wikiwand.com/en/Pascal_(programming_language)"
                  )}{" "}
                  coder. In 2003,i attended to{" "}
                  {linkItem("CS", "https://ceng.metu.edu.tr/")} faculty in{" "}
                  {linkItem("METU", "https://www.metu.edu.tr/")} and completed
                  my degree in 2008. Up to now, i worked on many different
                  programming languages, projects, companies and people.
                  <b></b>
                  <p>And here is my resume.</p>
                </p>
              </Typography>
            </Grid>

            <Grid item container alignItems="flex-start" justify="flex-start">
              <ResumeViewer></ResumeViewer>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </React.Fragment>
  );
};
export default About;
