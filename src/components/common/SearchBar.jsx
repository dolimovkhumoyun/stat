import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import ListItemText from "@material-ui/core/ListItemText";
import Fab from "@material-ui/core/Fab";
import SearchIcon from "@material-ui/icons/Search";

import { MuiPickersUtilsProvider, DateTimePicker } from "material-ui-pickers";

// pick utils
import MomentUtils from "@date-io/moment";
import DateFnsUtils from "@date-io/date-fns";
// import LuxonUtils from "@date-io/luxon";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getRegions, getPosts } from "../../redux/actions";
import useLoginForm from "../../hooks/CustomHooks";
import _ from "lodash";
import moment from "moment";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  formControlSelect: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  normalItem: {
    paddingLeft: 30,
    fontWeight: theme.typography.fontWeightMedium
  },
  group: {
    fontWeight: theme.typography.fontWeightBold,
    opacity: 1,
    display: "none"
  },
  fab: {
    margin: theme.spacing(1)
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const SearchBar = props => {
  const classes = useStyles();
  const formatTime = "YYYY-MM-DD HH:mm:ss";
  const startOfDay = moment()
    .startOf("day")
    .format(formatTime);
  const endOfDay = moment()
    .endOf("day")
    .format(formatTime);

  // const submit

  const {
    inputs,
    isSelectAllClicked,
    handleInputChange,
    handleSubmit
  } = useLoginForm(props);
  const [startDate, setStartDate] = useState(startOfDay);
  const [endDate, setEndDate] = useState(endOfDay);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    props.getRegions();
  }, []);

  useEffect(() => {
    if (props.regions.length !== 0) {
      const regionIds = _.map(props.regions, "value");
      props.getPosts(regionIds);
    }
  }, [props.regions]);

  const renderRegionsValue = values => {
    if (props.regions.length !== 0) {
      var d = [];
      let i = 0;

      props.regions.map(region =>
        values.map(id => {
          if (region.value === id && d[d.length - 1] !== "...") {
            i++;
            if (d.length > 2) {
              d.push("...");
              return _.join(d, ", ");
            }

            d.push(region.label);
          }
        })
      );
    }
    return _.join(d, ", ");
  };
  const onChange = e => {
    console.log(e);
  };

  const postSelect = posts => {
    console.log(posts);
  };

  const onMultiSelectClick = ({ target: input }) => {
    let tmp = posts;
    var index = tmp.indexOf(input.value);
    if (index > -1) {
      console.log("found");
      tmp.splice(index, 1);

      setPosts(tmp);
    } else {
      console.log("not found");
      setPosts(posts => [...posts, input.value]);
    }
  };
  const onSubmit = e => {
    console.log(e);
  };
  console.log(posts);
  return (
    <React.Fragment>
      <form className={classes.root} autoComplete="off" onSubmit={onSubmit}>
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="age-label-placeholder">
            Type
          </InputLabel>
          <Select
            required
            inputProps={{
              name: "type",
              id: "type-required"
            }}
            displayEmpty
            className={classes.selectEmpty}
            name="type"
            value={inputs.type || 10}
            onChange={handleInputChange}
          >
            <MenuItem value={10}>All</MenuItem>
            <MenuItem value={20}>Wanted</MenuItem>
            <MenuItem value={30}>Not Wanted</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={classes.formControl}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
              autoOk
              ampm={false}
              label="Start Date"
              format="YYYY-MM-DD HH:mm:ss"
              name="startDate"
              value={startDate}
              onChange={dateTime => {
                setStartDate(moment(dateTime).format(formatTime));
              }}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl className={classes.formControl}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DateTimePicker
              autoOk
              ampm={false}
              disableFuture
              format="YYYY-MM-DD HH:mm:ss"
              label="End Date"
              name="endDate"
              value={endDate}
              onChange={dateTime => {
                setEndDate(moment(dateTime).format(formatTime));
              }}
            />
          </MuiPickersUtilsProvider>
        </FormControl>
        <FormControl className={classes.formControl}>
          <TextField
            id="standard-uncontrolled"
            label="Car Number"
            defaultValue=""
            margin="none"
            name="carNumber"
            value={inputs.carNumber || ""}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl className={classes.formControlSelect}>
          <InputLabel htmlFor="select-multiple-checkbox">Regions</InputLabel>
          <Select
            multiple
            displayEmpty={true}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => renderRegionsValue(selected)}
            MenuProps={MenuProps}
            name="regions"
            value={inputs.regions || []}
            onChange={handleInputChange}
            // MenuProps={MenuProps}
          >
            <MenuItem
              key="-1"
              checked={isSelectAllClicked}
              value="-1"
              // onClick={() => setSelectedAll(true)}
            >
              <ListItemText
                primary={isSelectAllClicked ? "Unselect all" : "Select All"}
              />
            </MenuItem>
            {props.regions.map(region => (
              <MenuItem
                key={region.value}
                value={region.value}
                disabled={region.isoffline}
              >
                <Checkbox checked={inputs.regions.indexOf(region.value) > -1} />
                <ListItemText primary={region.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControlSelect}>
          <InputLabel htmlFor="select-multiple-checkbox">Posts</InputLabel>
          <Select
            multiple
            displayEmpty={true}
            input={<Input id="select-multiple-checkbox" />}
            name="posts"
            value={posts || []}
            // onChange={onChange}
          >
            {props.posts.map(post => {
              if (post.options[0].isOptGroup === undefined) {
                post.options.splice(0, 0, {
                  value: post.label,
                  label: post.label,
                  isOptGroup: true
                });
              }
              return post.options.map(option => {
                return (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    className={
                      option.isOptGroup
                        ? classes.disabledItem
                        : classes.normalItem
                    }
                    disabled={option.isOptGroup}
                  >
                    <Checkbox
                      className={option.isOptGroup ? classes.group : ""}
                    />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                );
              });
            })}
          </Select>
        </FormControl>
        <FormControl className={classes.formControlSelect}>
          <Fab color="primary" aria-label="add" className={classes.fab}>
            <SearchIcon />
          </Fab>
        </FormControl>
      </form>
    </React.Fragment>
  );
};
const mapStateToProps = ({ regions, posts }) => ({
  regions,
  posts
});

const mapDispatchToProps = dispatch => ({
  getRegions: () => dispatch(getRegions()),
  getPosts: data => dispatch(getPosts(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar);
