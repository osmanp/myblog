import { Button, Grid, TextField, Typography } from "@material-ui/core";
import React from "react";
import emailjs from "emailjs-com";

const EmailForm = () => {
  const [sender, setSender] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (title.length < 0 || body.length < 10) {
      return;
    }
    
    var template_params = {
      reply_to: "osmanpasalak@gmail.com",
      from_name: sender,
      to_name: "osmanpasalak@gmail.com",
      message_html: title + "" + body,
    };
    
    emailjs.send("gmail", "template_AwFYPT5H", template_params,'user_yr4BvDOtIyWr90pfBMwfe').then(
      function (response) {
      },
      function (err) {
      }
    );
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="your-name"
              variant="outlined"
              fullWidth
              value={sender}
              onInput={ e=>setSender(e.target.value)}
              placeholder="Your name"
              label="Your name"
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="title"
              variant="outlined"
              fullWidth
              value={title}
              onInput={ e=>setTitle(e.target.value)}
              placeholder="Title goes here"
              label="Title"
            ></TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="message"
              variant="outlined"
              fullWidth
              multiline
              value={body}
              onInput={ e=>setBody(e.target.value)}
              placeholder="Message goes here"
              label="Message"
              rows="12"
            ></TextField>
          </Grid>
          <Grid item>
            <Button variant="contained" type="submit" color="primary">
              <Typography>Send Email</Typography>
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default EmailForm;
