import {
  Container,
  CssBaseline,
  Grid,
  Typography,
  Divider,
} from "@material-ui/core";
import React from "react";
import { SocialMediaIconsReact } from "social-media-icons-react";
import EmailForm from "../components/EmailForm";
import Layout from "../components/Layout";
import styles from "../styles/links.scss";

const linkItem = (text, src) => (
  <>
    <a href={src} className={styles.linkx}>
      {text}
    </a>
  </>
);
const socialIconProps = {
  iconSize: 4,
  roundness: "50%",
};

const SocialMediaItem = ({ socialMediaName, socialMediaLabel, url }) => {
  return (
    <Grid container direction="row" justify="flex-start" alignItems='center' spacing={1}>
      <Grid item xs={1}>
        <SocialMediaIconsReact
          icon={socialMediaLabel}
          {...socialIconProps}
          url={url}
        />
      
      </Grid>
      <Grid item xs={2}>
      {linkItem(socialMediaName,url)}
      </Grid>
    </Grid>
  );
};

const Contact = (props) => {
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
            spacing={2}
            direction="column"
            alignItems="stretch"
            justify="center"
          >
            <Grid>
            <Typography
                variant="h4"
                style={{
                  fontFamily: "Consolas",
                  paddingBottom:'10px'
                }}
              >
                Social Media
              </Typography>
            </Grid>
            <Grid item xs={12}>
            <SocialMediaItem socialMediaName="twitter" socialMediaLabel={'twitter'} url={'https://twitter.com/osmanpasalak'}></SocialMediaItem>
            </Grid>
            <Grid item xs={12}>
            <SocialMediaItem socialMediaName="linkedin" socialMediaLabel={'linkedin'}url={'https://www.linkedin.com/in/osman-pa%C5%9Falak-92a62b5/'}></SocialMediaItem>
            </Grid>
            <Grid item xs={12}>
            <SocialMediaItem socialMediaName="github" socialMediaLabel={'github'} url={'https://github.com/osmanp'}></SocialMediaItem>
            </Grid>
            <Grid item xs={12}>
            <SocialMediaItem socialMediaName="reddit" socialMediaLabel={'reddit'} url={'https://www.reddit.com/user/agapec'}></SocialMediaItem>
            </Grid>

            <Grid item xs={12}>
              <Typography
                variant="h4"
                style={{
                  fontFamily: "Consolas",
                  paddingBottom:'10px',
                  paddingTop:'10px'
                }}
              >
                Send me Email
              </Typography>
            </Grid>

            <Grid item xs={8}>
              <EmailForm></EmailForm>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </React.Fragment>
  );
};
export default Contact;
