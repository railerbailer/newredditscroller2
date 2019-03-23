import React, { Component } from "react";
import { Spin } from "antd";

class Image extends Component {
  state = {
    loaded: false
  };

  render() {
    const { className, src, onClick } = this.props;
    const { loaded } = this.state;
    return (
      <img
       
        className={`${className} ${loaded ? "loaded" : "undone"}`}
        onClick={onClick}
        onLoad={() => this.setState({ loaded: true })}
        src={src}
      />
    );
  }
}

export default Image;
