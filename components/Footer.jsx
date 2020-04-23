import {
  AppBar,
  Container,
  Toolbar,
  Typography,
  Grid,
  CssBaseline
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import { SocialMediaIconsReact } from "social-media-icons-react";

// ReactDOM.render(<SocialMediaIconsReact icon="twitter" url="https://twitter.com/your-twitter-handle"/>,	document.getElementById('root'));

function Copyright() {
  return (
    <Typography color="inherit" variant="subtitle2" align="center"
    style={{
      fontFamily: "\"Consolas\", \"Helvetica\", \"Arial\", sans-serif",
    }}>
      {"Copyright © "}
      OsmanP. {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "#404752",
    top: 'auto',
    bottom: 0 ,
    height:'50px'
  },  
  footer: {    
    
    },
}));

const socialIconProps = {
    iconSize: 4,
    roundness: "50%",
    backgroundColor:"rgba(56,63,73,1)"
}

export default function Footer(props) {
  const classes = useStyles();
  return (
      <div>
      <AppBar position="fixed" className={classes.appBar}>
        <CssBaseline></CssBaseline>
        <Toolbar className={classes.toolbar}>
          <Container maxWidth="md" className={classes.footer}>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Grid container >
                  <Grid item xs={2}>
                    <SocialMediaIconsReact
                      icon="twitter"
                      {...socialIconProps}
                      url="https://twitter.com/osmanpasalak"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SocialMediaIconsReact
                      icon="linkedin"
                      {...socialIconProps}
                      url="https://www.linkedin.com/in/osman-pa%C5%9Falak-92a62b5/"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SocialMediaIconsReact
                      icon="github"
                      {...socialIconProps}
                      url="https://github.com/osmanp"
                    />
                  </Grid>
                  <Grid item xs={2}>
                    <SocialMediaIconsReact
                      icon="mail"
                      {...socialIconProps}
                      url="mailto:osmanpasalak@gmail.com"
                    />
                  </Grid>
                  <Grid item xs={6}></Grid>
                </Grid>
              </Grid>
              <Grid item xs={6}>
                <Copyright />
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>    
      </div>
  );
}
