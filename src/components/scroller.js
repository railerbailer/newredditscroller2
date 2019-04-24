import React, { Component } from "react";
import Swipeable from "react-swipeable";
import "antd/dist/antd.css";
import "../App.css";
import _ from "lodash";
import AddMarkup from "./addMarkup";
import { Icon, message } from "antd";
import "../App.css";
import { dataHandler, shuffleArray, dataMapper } from "../utils/atomic";
import { carPath } from "../utils/carPath";
import LoginModal from "./loginModal";
import SearchComponent from "./search";
import SwitchCategoryButtons from "./switchCategoryButtons";
import MainDropDownMenu from "./mainDropDownMenu";
import GoBackButton from "./goBackButton";

class Scroller extends Component {
  render() {
    return <div style={{ color: "white" }}>hej</div>;
  }
}

export default Scroller;
