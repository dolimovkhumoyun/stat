import React from "react";
import { connect } from "react-redux";
import MUIDataTable from "mui-datatables";
import _ from "lodash";
const columns = [
  {
    name: "car_number",
    label: "Car Number",
    options: {
      filter: true,
      sort: true
    }
  },
  {
    name: "the_date",
    label: "Date",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "camera",
    label: "Camera",
    options: {
      filter: true,
      sort: false
    }
  },
  {
    name: "ip",
    label: "IP",
    options: {
      filter: true,
      sort: false
    }
  }
];
const options = {
  filterType: "checkbox"
};

const CustomTable = props => {
  const { searchResult } = props.results;
  if (
    searchResult !== undefined &&
    _.findIndex(searchResult, ["id", props.selectedListIndex]) !== -1
  ) {
    let data =
      searchResult[_.findIndex(searchResult, ["id", props.selectedListIndex])]
        .data;
    return (
      <MUIDataTable
        title={"Employee List"}
        data={data}
        columns={columns}
        options={options}
      />
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
