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

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getRegions, getPosts, setForm } from "../../redux/actions";
import useLoginForm from "../../hooks/CustomHooks";

import _ from "lodash";
import moment from "moment";
import { isIP } from "net";

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

  // ComponenentDidMount
  useEffect(() => {
    props.getRegions();
  }, []);

  // ComponentWillRecieveProps
  useEffect(() => {
    if (props.regions.length !== 0) {
      const regionIds = _.map(props.regions, "value");
      props.getPosts(regionIds);
    }
  }, [props.regions]);

  const [inputs, setInputs] = useState({ carNumber: "", type: "all" });
  const [startDate, setStartDate] = useState(startOfDay);
  const [endDate, setEndDate] = useState(endOfDay);
  const [regions, setRegions] = useState([]);
  const [isSelectAllClicked, setSelectAll] = useState(false);
  const [posts, setPosts] = useState([]);

  const handleInputChange = e => {
    let value = e.target.value;
    if (e.target.name === "carNumber") {
      value = value.toUpperCase();
    }
    setInputs(inputs => ({
      ...inputs,
      [e.target.name]: value
    }));
  };

  const handleRegionChange = e => {
    const region = e.target.value;
    var selectedRegionLabels = [];
    var selectedPosts = [];
    var selectedPostIds = [];
    const allRegionIds = _.map(
      _.filter(props.regions, ["isoffline", false]),
      "value"
    );

    region.map(r => {
      props.regions.map(regs => {
        if (regs.value === r) {
          selectedRegionLabels.push(regs.label);
          return false;
        }
      });
    });

    selectedRegionLabels.map(s => {
      props.posts.map(p => {
        if (p.label == s) {
          selectedPosts.push(p.options);
          return false;
        }
      });
    });

    selectedPosts.map(s => {
      s.map(o => {
        if (!o.isDisabled) selectedPostIds.push(o.value);
        return false;
      });
    });

    var allPostIds = props.posts.map(post =>
      _.map(_.filter(post.options, ["isDisabled", false]), "value")
    );
    allPostIds = _.flatten(allPostIds);

    if (_.indexOf(e.target.value, "-1") !== -1 && !isSelectAllClicked) {
      setRegions(allRegionIds);
      setPosts(allPostIds);
      setSelectAll(true);
    } else if (_.indexOf(e.target.value, "-1") !== -1 && isSelectAllClicked) {
      setRegions([]);
      setPosts([]);
      setSelectAll(false);
    } else {
      setRegions(e.target.value);
      setPosts(selectedPostIds);
    }
  };

  const handlePostChange = e => {
    let selectedRegions = [];
    let selectedRegionIds = [];
    let posts = e.target.value;
    posts.map(post => {
      props.posts.map(p => {
        p.options.map(o => {
          if (post === o.value) selectedRegions.push(p.label);
        });
      });
    });

    selectedRegions = _.sortedUniq(selectedRegions);
    selectedRegions.map(s => {
      props.regions.map(r => {
        if (s === r.label) {
          selectedRegionIds.push(r.value);
        }
      });
    });
    selectedRegionIds = _.union(regions, selectedRegionIds);
    setRegions(selectedRegionIds);
    setPosts(e.target.value);
  };

  // renders the values of selected options ex: Andijon,Toshkent,Samarqand...
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

  // renders the values of selected options ex: Andijon,Toshkent,Samarqand...
  const renderPostsValue = values => {
    if (props.posts.length !== 0) {
      var d = [];
      let i = 0;

      props.posts.map(post =>
        post.options.map(option => {
          values.map(id => {
            if (option.value === id && d[d.length - 1] !== "...") {
              if (d.length > 2) {
                d.push("...");
                return _.join(d, ", ");
              }

              d.push(option.label);
            }
          });
        })
      );
    }
    return _.join(d, ", ");
  };

  const isIP = value => {
    const isIp = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/.test(
      value
    );
    return isIp;
  };

  const onSubmit = e => {
    e.preventDefault();
    const spr = regions.map(Number);
    let tmpPosts = [];
    posts.map(p => {
      if (isIP(p)) {
        tmpPosts.push(p);
      }
    });
    const formData = {
      carNumber: inputs.carNumber,
      type: inputs.type,
      direction: regions,
      posts: tmpPosts,
      startDate,
      endDate,
      spr
    };
    props.setForm(formData);
  };

  return (
    <React.Fragment>
      <form className={classes.root} autoComplete="off" onSubmit={onSubmit}>
        <FormControl className={classes.formControl}>
          <InputLabel shrink htmlFor="age-label-placeholder">
            Type
          </InputLabel>
          <Select
            required
            displayEmpty
            className={classes.selectEmpty}
            name="type"
            value={inputs.type}
            onChange={handleInputChange}
          >
            <MenuItem value={"all"}>All</MenuItem>
            <MenuItem value={"1"}>Wanted</MenuItem>
            <MenuItem value={"0"}>Not Wanted</MenuItem>
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
          <InputLabel htmlFor="select-multiple-checkbox" required>
            Regions
          </InputLabel>
          <Select
            multiple
            displayEmpty={true}
            input={<Input id="select-multiple-checkbox" />}
            renderValue={selected => renderRegionsValue(selected)}
            MenuProps={MenuProps}
            name="regions"
            value={regions || []}
            onChange={handleRegionChange}
          >
            <MenuItem
              key="-1"
              checked={isSelectAllClicked}
              value="-1"
              onChange={handleRegionChange}
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
                <Checkbox checked={regions.indexOf(region.value) > -1} />
                <ListItemText primary={region.label} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={classes.formControlSelect}>
          <InputLabel htmlFor="select-multiple-checkbox">Posts</InputLabel>
          <Select
            required
            multiple
            displayEmpty={true}
            input={<Input id="select-multiple-checkbox" />}
            name="posts"
            value={posts || []}
            onChange={handlePostChange}
            renderValue={selected => renderPostsValue(selected)}
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
                    disabled={option.isDisabled || option.isOptGroup}
                  >
                    <Checkbox
                      checked={posts.indexOf(option.value) > -1}
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
          <Fab
            type="submit"
            color="primary"
            aria-label="add"
            className={classes.fab}
          >
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
  getPosts: data => dispatch(getPosts(data)),
  setForm: data => dispatch(setForm(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBar);
