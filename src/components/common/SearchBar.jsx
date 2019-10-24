import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { MuiPickersUtilsProvider, DateTimePicker } from "material-ui-pickers";

// pick utils
// import MomentUtils from "@date-io/moment";
import DateFnsUtils from "@date-io/date-fns";
// import LuxonUtils from "@date-io/luxon";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const SearchBar = props => {
  const classes = useStyles();

  const onChange = e => {
    console.log(e.target);
  };

  return (
    <React.Fragment>
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="age-label-placeholder">
            Type
          </InputLabel>
          <Select
            required
            // value={values.age}
            onChange={onChange}
            inputProps={{
              name: "type",
              id: "type-required"
            }}
            displayEmpty
            name="type"
            className={classes.selectEmpty}
          >
            <MenuItem value={10}>All</MenuItem>
            <MenuItem value={20}>Wanted</MenuItem>
            <MenuItem value={30}>Not Wanted</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              autoOk
              ampm={false}
              disableFuture
              // value={selectedDate}
              // onChange={handleDateChange}
              label="Start Date"
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl className={classes.formControl}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              autoOk
              ampm={false}
              disableFuture
              //   value={selectedDate}
              // onChange={handleDateChange}
              label="End Date"
            />
          </MuiPickersUtilsProvider>
        </FormControl>
      </form>
    </React.Fragment>
  );
};

export default SearchBar;
