import { AppBar, Avatar, Button, Container, CssBaseline, Grid, Toolbar, Typography } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import { useRouter } from "next/router";
import React from "react";
import Link from "./Link";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "#404752",
    overflowY: "hidden",
  },
  avatarSmall: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  toolbarTitle:{
    fontFamily:'Consolas',
    fontSize:'18px',
    fontWeight:400,    
  },  
  avatarLarge: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    backgroundColor: "rgba(0,0,0,0)",
    borderRadius: "50%",
    border: 0,
    "&:hover": {
      cursor: "pointer",
    },
    circularPortrait: {
      borderRadius: "50%",
    },
  },
}));

const NavBarItem = ({ text, href }) => {
  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <Typography
      color="inherit"
      align="center"
      noWrap      
      className={classes.toolbarTitle}
      style={{fontSize:'1.1rem'}}
    >
      
       <Link
        variant="inherit"
        color="inherit"
        href={"/" + href}
        underline="none"
      >
        {text}
      </Link> 
    </Typography>
  );
};

const Navbar = ( props ) => {
  const classes = useStyles();
  const router = useRouter();
  const handleAvatarClick = () => {    
    router.push("/index");    
  };
  const handleThemeChange = () => {
    console.log(props);
    props.onThemeChange();
  }
  return (
    <React.Fragment>
      <AppBar position="fixed" className={classes.appBar}>
        <CssBaseline />
        <Toolbar className={classes.toolbar}>
          <Container maxWidth="md">
            <Grid container alignContent="center" alignItems="center">
              <Grid item xs={6}>
                <Grid container alignContent="center">
                  <Grid item xs={2}>
                    <Avatar
                      alt="Osman P"
                      src="/photos/blogChip.jpg"
                      className={classes.avatarLarge}
                      onClick={handleAvatarClick}
                    ></Avatar>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography
                      component="h2"
                      variant="h5"
                      noWrap
                      align="left"                      
                      style={{  paddingLeft: "10px",paddingTop:'10px' ,fontFamily:'Garamond'}}
                    > {'BLOG'}</Typography>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Grid container alignContent="stretch" justify="space-between">
                  <Grid item>
                    <NavBarItem text={"About Me"} href={"about"}></NavBarItem>
                  </Grid>
                  <Grid item xs={3}>
                    <NavBarItem
                      text={"Article Me"}
                      href={"articles"}
                    ></NavBarItem>
                  </Grid>
                  <Grid item>
                    <NavBarItem
                      text={"Contact Me"}
                      href={"contact"}
                    ></NavBarItem>
                  </Grid>
                  <Grid item>
                    <Typography color="inherit" align="inherit" noWrap>
                      <Button onClick={handleThemeChange}>
                        <Brightness4Icon
                          style={{ color: green[200], fontSize: "22" }}
                        ></Brightness4Icon>
                      </Button>
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  );
};

export default Navbar;
