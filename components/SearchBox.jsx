import React from "react";
import { TextField, InputAdornment, Grid, Button } from "@material-ui/core";
import KeyboardIcon from "@material-ui/icons/Keyboard";

const SearchBox = ({ onSearch,onReset }) => {
  const onChange = (event) => {
    if (event.target.value && event.target.value.length > 2) {
      onSearch(event.target.value);
    }
  };
  
  return (
    <>
      <Grid
        container
        justify="center"
        alignItems="center"
        alignContent="flex-start"
        direction="row"
        spacing={1}
      >
        <Grid item xs={10}>
          <TextField
            type="search"
            variant="outlined"
            placeholder="Search Articles"
            fullWidth
            margin="normal"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <KeyboardIcon />
                </InputAdornment>
              ),
            }}
            onChange={onChange}
          ></TextField>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary"
          onClick={onReset}
          >
            {"Reset"}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default SearchBox;
