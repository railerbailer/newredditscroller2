import React, { Component } from "react";

class Image extends Component {
  componentDidMount(){

  }
  render() {
    const { className, src, onClick } = this.props;
    console.log(this.img && this.img.error)
    return (
      <img
        alt="Image could not be loaded"
        className={className}
        ref={img => (this.img = img)}
        onClick={onClick}
        src={src}
      />
    );
  }
}

export default Image;
