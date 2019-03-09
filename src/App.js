import React, { Component } from "react";
import "antd/dist/antd.css";
import "./App.css";
import Scroller from "./components/scroller";
import { BrowserRouter, Route, Redirect } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Redirect to="/startpage"/>
          <Route path="/:subreddit" exact component={Scroller} />
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
