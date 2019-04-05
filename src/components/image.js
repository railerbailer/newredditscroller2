import React, { Component } from "react";

class Image extends Component {
  state = {
    loaded: false
  };

  render() {
    imageError=false
    const { className, src, onClick } = this.props;
    const { loaded } = this.state;

    return (
      <img
        alt="Image could not be loaded"
        className={className}
        ref={img => this.img = img}
        onClick={onClick}
   

        src={src}
      />
    );
  }
}

export default Image;
