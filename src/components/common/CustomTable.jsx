import React from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import _ from "lodash";

import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

const columns = [
  {
    name: "car_number",
    label: "Car Number",
    options: {
      filter: false,
      sort: true
    }
  },
  {
    name: "the_date",
    label: "Date",
    options: {
      filter: false,
      sort: true
    }
  },
  {
    name: "camera",
    label: "Camera",
    options: {
      filter: false,
      sort: true
    }
  },
  {
    name: "ip",
    label: "IP",
    options: {
      filter: false,
      sort: true
    }
  }
];
const options = {
  pagination: false,
  print: false,
  viewColumns: false,
  filter: false,
  selectableRows: "none",
  responsive: "scroll"
};

const CustomTable = props => {
  const getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableBodyCell: {
          root: {
            backgroundColor: "#FF0000"
          }
        }
      }
    });

  const { searchResult } = props.results;
  if (
    searchResult !== undefined &&
    _.findIndex(searchResult, ["id", props.selectedListIndex]) !== -1
  ) {
    let data =
      searchResult[_.findIndex(searchResult, ["id", props.selectedListIndex])]
        .data;
    return (
      // <MuiThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={"Result"}
        data={data}
        columns={columns}
        options={options}
      />
      // </MuiThemeProvider>
    );
  } else {
    return "";
  }
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
)(CustomTable);
