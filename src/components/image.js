import React, { Component } from "react";

class Image extends Component {
  state = {
    loaded: false
  };

  render() {
    const { className, src, onClick } = this.props;
    const { loaded } = this.state;
    return (
      <img
        alt="Image could not be loaded"
        className={`${className} ${loaded ? "loaded" : "undone"}`}
        onClick={onClick}
        onLoad={() => this.setState({ loaded: true })}
        src={src}
      />
    );
  }
}

export default Image;
