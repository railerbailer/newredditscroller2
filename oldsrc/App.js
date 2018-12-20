import React, { Component } from "react";
import "antd/dist/antd.css";
import "./App.css";
import Scroller from "./components/scroller";

class App extends Component {
  constructor(props) {
    super(props);

    this.categorySet = this.categorySet.bind(this);
    this.autoplayPress = this.autoplayPress.bind(this);

    this.state = {
      nsfwAccept: false,
      category: "Switch category",
      autoplay: false
    };
  }

  categorySet = async val => {
    await this.setState({
      category: val
    });
  };

  autoplayPress() {
    this.setState({ autoplay: !this.state.autoplay });
  }
  render() {
    return (
      <Scroller
        autoplay={this.state.autoplay}
        categorySet={this.categorySet}
        category={this.state.category}
      />
    );
  }
}

export default App;
