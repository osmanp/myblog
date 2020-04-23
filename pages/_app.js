import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { lightTheme,darkTheme } from "../context/Theme";

const MyApp = ({ Component, pageProps }) => {
  useEffect(() => {    
    //Remove server side injected CSS
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);


  const lTheme = createMuiTheme(lightTheme);
  const dTheme = createMuiTheme(darkTheme);
  const [theme,changeTheme] = useState(lTheme)
  
  const onThemeChange = () => {
    var themeType = localStorage.getItem('theme');
    if(!themeType || themeType == 'light'){
      changeTheme(dTheme);
      localStorage.setItem('theme','dark');
    }
    else {
      changeTheme(lTheme);
      localStorage.setItem('theme','light');
    }    
  }
  const newProps =  {onThemeChange, ...pageProps};
  return (
    <React.Fragment>
      <Head>
        <title> {'Osman Paşalak Personal Blog'} </title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...newProps} />
        </ThemeProvider>      
    </React.Fragment>
  );
};

MyApp.propTypes = {
  Component: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  pageProps: PropTypes.object,
};

export default MyApp;
