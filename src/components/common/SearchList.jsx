import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import _ from "lodash";

import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  }
}));

const SearchList = props => {
  const classes = useStyles();
  const [searchedRegions, setRegions] = useState([]);

  useEffect(() => {
    const { formData } = props.results;
    if (formData !== undefined) {
      let tmpRegions = [];
      formData.direction.map(d => {
        props.regions.map(r => {
          if (d === r.value) tmpRegions.push(r);
          return false;
        });
        return false;
      });
      setRegions(tmpRegions);
    }
  }, [props.results]);

  const countResults = id => {
    const { searchResultCount } = props.results;

    let flag = _.get(
      _.find(props.results.searchResultCount, ["id", id]),
      "count"
    );

    if (
      searchResultCount !== undefined &&
      _.findIndex(searchResultCount, ["id", id]) !== -1
    ) {
      let element = "";
      element = searchResultCount.map(m => {
        return m.id === id ? m.count : "";
      });

      return flag === -1 ? " " : element;
    } else {
      return (
        <Loader
          type="ThreeDots"
          color="#00BFFF"
          height={20}
          width={30}
          timeout={3000} //3 secs
        />
      );
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
              disabled={
                _.get(
                  _.find(props.results.searchResultCount, ["id", s.value]),
                  "count"
                ) === -1 ||
                _.find(props.results.searchResultCount, ["id", s.value]) === -1
              }
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchList);
