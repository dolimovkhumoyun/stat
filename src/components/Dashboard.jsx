import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { mainListItems } from "./common/List";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
// import Chart from "./Chart";
// import Deposits from "./Deposits";
// import Orders from "./Orders";

import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  getRegions,
  setResult,
  setResultCount,
  getResult,
  setPdfResult
} from "../redux/actions";
import SearchBar from "./common/SearchBar";
import SearchList from "./common/SearchList";
import CustomTable from "./common/CustomTable";
import { socket } from "../redux/middleWares";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

import _ from "lodash";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

import LoadingOverlay from "react-loading-overlay";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: "none"
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: "100vh",
    overflow: "auto"
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(1),
    display: "flex",
    overflow: "auto",
    flexDirection: "column"
  },
  fixedHeight: {
    height: "65vh"
  },
  "@global": {
    "*::-webkit-scrollbar": {
      width: "0.4em"
    },
    "*::-webkit-scrollbar-track": {
      "-webkit-box-shadow": "inset 0 0 6px rgba(0,0,0,0.00)"
    },
    "*::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(0,0,0,.1)",
      outline: "1px solid slategrey"
    }
  },
  margin: {
    margin: theme.spacing(1),
    width: "200px",
    marginTop: "25px",
    marginLeft: "40%"
  },
  extendedIcon: {
    marginRight: theme.spacing(1)
  }
}));

function Dashboard(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [selectedListIndex, setSelectedListIndex] = useState();
  const [image, setImage] = useState(null);
  const [isLightBoxVisible, setLightBoxVisibilty] = useState(false);
  const [isMoreLoading, setMoreLoading] = useState(false);
  const [isActiveLoader, setActiveLoader] = useState(false);

  useEffect(() => {
    document.title = "FizmaSoft";
    props.getRegions();
    socket.on("search", data => {
      props.setResult(data);
      setMoreLoading(false);
    });
    socket.on("count", data => {
      props.setResultCount(data);
    });
    socket.on("image", data => {
      let imgBase64 = `data:image/png;base64,${data.data[0].car_photo}`;
      setImage(imgBase64);
      setLightBoxVisibilty(true);
    });
    socket.once("err", data => {
      if (data.status === 401) {
        localStorage.removeItem("token");
        props.history.push({
          pathname: "/",
          state: { err: 401 }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (props.results.pdfResult && props.results.formData) {
      // printAllData(header, startDate, endDate, data);
      let { startDate, endDate } = props.results.formData;
      const { pdfResult } = props.results;
      let regionName = _.find(props.regions, ["value", selectedListIndex]);
      let headers = {
        regionName: regionName.label,
        startDate,
        endDate
      };
      printAllData(headers, pdfResult);
    }
  }, [props.results.pdfResult]);

  const onListSelect = (event, index) => {
    // console.log(event.target);
    setSelectedListIndex(index);
  };

  const onMoreClick = (e, regionId) => {
    let clickedRegion = _.find(props.results.searchResult, ["id", regionId]);
    const {
      posts,
      carNumber,
      type,
      startDate,
      endDate,
      spr
    } = props.results.formData;
    let offset = clickedRegion.data.length;
    const data = {
      direction: [regionId],
      posts,
      carNumber,
      type,
      startDate,
      endDate,
      spr,
      offset: offset,
      token: localStorage.getItem("token")
    };
    setMoreLoading(true);
    socket.emit("search", data);
    let tableBody = document.getElementsByClassName(
      "table_" + selectedListIndex
    );

    tableBody[0].scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest"
    });
  };

  const onDoubleClick = row => {
    let data = {
      event_id: row.event_id,
      ip: row.ip,
      the_date: row.the_date,
      token: localStorage.getItem("token")
    };
    socket.emit("loadImage", data);
  };

  const onPrintClick = id => {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const { startDate, endDate, type, carNumber } = props.results.formData;
    const forms = {
      type,
      carNumber,
      startDate,
      endDate,
      direction: [id],
      spr: [id],
      pdf: true
    };
    setActiveLoader(true);
    props.getResult(forms);
    socket.on("pdf", data => {
      setActiveLoader(false);
      props.setPdfResult(data);
    });
  };

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

  const printAllData = (headers, data) => {
    let header = `${headers.regionName}   ${headers.startDate} dan  -  ${headers.endDate} gacha `;
    var docDefinition = {
      content: [
        { text: header, style: "subheader" },
        {
          // layout: "lightHorizontalLines", // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: ["auto", "*", "*", "auto", "auto"],

            body: [
              [
                "#",
                "YPX maskanlari",
                "Yo‘nalish",
                "Sana va vaqt",
                "Avtomobil D.R.B"
              ]
            ]
          }
        }
      ],
      styles: {
        subheader: {
          fontSize: 16,
          bold: true,
          margin: 10
        }
      }
    };
    // console.log(data);
    data.map((d, index) =>
      docDefinition.content[1].table.body.push([
        index + 1,
        d.camera,
        renderPostName(d.ip),
        d.the_date,
        d.car_number
      ])
    );

    pdfMake.tableLayouts = {
      exampleLayout: {
        hLineWidth: function(i, node) {
          if (i === 0 || i === node.table.body.length) {
            return 0;
          }
          return i === node.table.headerRows ? 2 : 1;
        },
        vLineWidth: function(i) {
          return 0;
        },
        hLineColor: function(i) {
          return i === 1 ? "black" : "#aaa";
        },
        paddingLeft: function(i) {
          return i === 0 ? 0 : 8;
        },
        paddingRight: function(i, node) {
          return i === node.table.widths.length - 1 ? 0 : 8;
        }
      }
    };

    // download the PDF
    pdfMake
      .createPdf(docDefinition)
      .download(
        `${headers.regionName}_${headers.startDate}-${headers.endDate}.pdf`
      );
  };

  const onLogOut = e => {
    e.preventDefault();
    localStorage.removeItem("token");
    props.history.push("/");
  };

  const onSubmit = formData => event => {
    event.preventDefault();
    console.log(formData);
  };

  return (
    <LoadingOverlay
      active={isActiveLoader}
      spinner
      text="Ma'lumotlar yuklanmoqda..."
    >
      <div className={classes.root}>
        {isLightBoxVisible && (
          <Lightbox
            mainSrc={image}
            onCloseRequest={() => setLightBoxVisibilty(false)}
          />
        )}
        <CssBaseline />
        <AppBar
          position="absolute"
          className={clsx(classes.appBar, open && classes.appBarShift)}
        >
          <Toolbar className={classes.toolbar}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              className={clsx(
                classes.menuButton,
                open && classes.menuButtonHidden
              )}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              className={classes.title}
            >
              Qidiruv
            </Typography>
            <IconButton color="inherit">
              <ExitToAppIcon onClick={onLogOut} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          classes={{
            paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
          }}
          open={open}
        >
          <div className={classes.toolbarIcon}>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>{mainListItems}</List>

          <Divider />
          {/* <List>{secondaryListItems}</List> */}
        </Drawer>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="xl" className={classes.container}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                {/* *** Search DIV*** */}
                <Paper className={classes.paper}>
                  <SearchBar onSubmit={formData => onSubmit(formData)} />
                </Paper>
              </Grid>
              {/* *** Regions DIV */}
              <Grid item xs={12} md={3} lg={2}>
                <Paper className={fixedHeightPaper}>
                  <SearchList
                    onListSelect={onListSelect}
                    selectedListIndex={selectedListIndex}
                  />
                </Paper>
              </Grid>
              {/* *** Table DIV *** */}
              <Grid item xs={12} md={9} lg={10}>
                <Paper className={fixedHeightPaper}>
                  <CustomTable
                    selectedListIndex={selectedListIndex}
                    onMoreClick={onMoreClick}
                    onDoubleRowClick={onDoubleClick}
                    onPrintClick={onPrintClick}
                    renderPostName={renderPostName}
                    isMoreLoading={isMoreLoading}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Container>
          {/* <Copyright /> */}
        </main>
      </div>
    </LoadingOverlay>
  );
}

const mapStateToProps = ({ regions, posts, results }) => ({
  regions,
  posts,
  results
});

const mapDispatchToProps = dispatch => ({
  getRegions: () => dispatch(getRegions()),
  getResult: data => dispatch(getResult(data)),
  setResult: data => dispatch(setResult(data)),
  setResultCount: data => dispatch(setResultCount(data)),
  setPdfResult: data => dispatch(setPdfResult(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
