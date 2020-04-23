import React from "react";
import { Grid, Paper, Container,Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { HourglassEmpty, ArrowLeft, ArrowRight } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100vh",
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

const StepIcons = ({left}) => {
  return (
    <Grid container>
      <Grid item xs={4}>
          {left ? <ArrowLeft></ArrowLeft> : null}
      </Grid>
      <Grid item xs={4}>
      <HourglassEmpty></HourglassEmpty>
      </Grid>
      <Grid item xs={4}>
      {!left ? <ArrowRight></ArrowRight> : null}
      </Grid>
    </Grid>
  );
};

const FormLeftItem = (props) => {
  return (
    <React.Fragment>
      <Grid item xs={4}>
        {props.children}
      </Grid>
      <Grid item xs={2}>
        <StepIcons left={true}></StepIcons>
      </Grid>
      <Grid item xs={4}></Grid>
    </React.Fragment>
  );
};

const FormRightItem = (props) => {
  return (
    <React.Fragment>
      <Grid item xs={4}></Grid>
      <Grid item xs={2}>
      <StepIcons left={false}></StepIcons>
      </Grid>
      <Grid item xs={4}>
        {props.children}
      </Grid>
    </React.Fragment>
  );
};

const TimeLine = () => {
  const classes = useStyles();

  return (
    <Container
      maxWidth="md"
      style={{ marginBottom: "200px", minWidth: "100vh" }}
    >
      <Grid container spacing={3} direction="column" alignItems="stretch">
        <Grid container item  spacing={1}>
          <FormLeftItem>
            <Paper className={classes.paper}>
                <Typography>
            asdsadas

                </Typography>
            </Paper>
          </FormLeftItem>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <FormRightItem>
            <Paper className={classes.paper}>                <Typography>
               asdasd

                </Typography></Paper>
          </FormRightItem>
        </Grid>
        <Grid container item xs={12} spacing={3}>
          <FormLeftItem>
            <Paper className={classes.paper}>                <Typography>
               asdasddsa

                </Typography></Paper>
          </FormLeftItem>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TimeLine;
