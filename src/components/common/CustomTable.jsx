import React from "react";
import { connect } from "react-redux";
import _ from "lodash";

import {
  Button,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Box
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Empty } from "antd";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const columns = [
  {
    id: "ip",
    label: "ЙПХ масканлари"
  },
  {
    id: "camera",
    label: "	Йўналиш"
  },
  {
    id: "date",
    label: "Сана ва вакт"
  },
  {
    id: "car_number",
    label: "Давлат ДРБ"
  }
];

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%"
  },
  tableWrapper: {
    maxHeight: "47vh",
    overflow: "auto"
  },
  margin: {
    margin: theme.spacing(1),
    width: "200px",
    marginTop: "25px",
    marginLeft: "40%"
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  },
  empty: {
    width: "50px",
    margin: "50px",
    marginLeft: "600px"
  },
  button: {
    margin: theme.spacing(1)
  }
}));

const CustomTable = props => {
  const classes = useStyles();
  const customColumnStyle = { width: 12 };

  const renderPostName = ip => {
    let name = "";
    props.posts.map(p => {
      p.options.map(o => {
        if (o.value === ip) name = o.label;
        return false;
      });
      return false;
    });
    return name;
  };

  const { searchResult, searchResultCount } = props.results;
  if (
    searchResult !== undefined &&
    _.findIndex(searchResult, ["id", props.selectedListIndex]) !== -1
  ) {
    let data =
      searchResult[_.findIndex(searchResult, ["id", props.selectedListIndex])]
        .data;
    let count =
      searchResultCount[
        _.findIndex(searchResult, ["id", props.selectedListIndex])
      ].count;

    return (
      <React.Fragment>
        <Paper className={classes.root}>
          <Grid item xs={4}>
            {" "}
            <Box fontFamily="fontFamily" m={1}>
              {`Намойиш этилаябди  ${data.length} та ёзув ${count} тадан.`}
            </Box>
          </Grid>
          <Grid item xs={4}>
            {" "}
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              startIcon={<GetAppIcon />}
              onClick={() => props.onPrintClick(props.selectedListIndex)}
            >
              Юклаб олиш
            </Button>
          </Grid>

          <div className={classes.tableWrapper}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={customColumnStyle}>#</TableCell>
                  {columns.map(element => (
                    <TableCell key={element.id} align={element.align}>
                      {element.label}
                    </TableCell>
                  ))}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={`table_${props.selectedListIndex}`}>
                {data.length === 0 ? (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={false}
                    className={classes.empty}
                  />
                ) : (
                  data.map((row, index) => (
                    <TableRow
                      key={index}
                      onDoubleClick={() => props.onDoubleRowClick(row)}
                    >
                      <TableCell style={customColumnStyle}>
                        {index + 1}
                      </TableCell>
                      <TableCell>{renderPostName(row.ip)}</TableCell>
                      <TableCell>{row.camera}</TableCell>
                      <TableCell>{row.the_date}</TableCell>
                      <TableCell>{row.car_number}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Paper>

        <Button
          variant="outlined"
          size="small"
          color="primary"
          className={classes.margin}
          disabled={data.length === 0 || props.isMoreLoading}
          onClick={e => props.onMoreClick(e, props.selectedListIndex)}
        >
          {props.isMoreLoading ? (
            <Loader
              type="ThreeDots"
              color="#3F51B5"
              height={20}
              width={30}
              timeout={3000} //3 secs
              className={classes.extendedIcon}
            />
          ) : (
            <KeyboardArrowDownIcon className={classes.extendedIcon} />
          )}
          Кўпрок натижалар
        </Button>
      </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomTable);
