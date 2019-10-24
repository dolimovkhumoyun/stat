import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  // state = {  }

  render() {
    return (
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/" component={Login} />
      </Switch>
    );
  }
}

export default App;
