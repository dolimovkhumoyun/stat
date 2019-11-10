import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import DirectionsCarIcon from "@material-ui/icons/DirectionsCar";
import Badge from "@material-ui/core/Badge";
import HourglassFullIcon from "@material-ui/icons/HourglassFull";
import CircularProgress from "@material-ui/core/CircularProgress";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import _ from "lodash";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

const SerachList = props => {
  const classes = useStyles();
  const [searchedRegions, setRegions] = useState([]);

  useEffect(() => {
    const { formData } = props.results;
    if (formData !== undefined) {
      let tmpRegions = [];
      formData.direction.map(d => {
        props.regions.map(r => {
          if (d === r.value) {
            tmpRegions.push(r);
          }
        });
      });
      setRegions(tmpRegions);
    }
  }, [props.results]);

  const countResults = id => {
    const { searchResultCount } = props.results;

    if (
      searchResultCount !== undefined &&
      _.findIndex(searchResultCount, ["id", id] !== -1)
    ) {
      let element = "";
      element = searchResultCount.map(m => {
        return m.id === id ? m.count : "";
      });
      return element;
    } else {
      return <CircularProgress />;
    }
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        {searchedRegions.map(s => (
          <React.Fragment>
            <ListItem
              button
              selected={props.selectedListIndex === s.value}
              onClick={event => props.onListSelect(event, s.value)}
            >
              <ListItemText primary={s.label} />
              {countResults(s.value)}
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

const mapStateToProps = ({ regions, posts, results }) => ({
  regions,
  posts,
  results
});

const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SerachList);
