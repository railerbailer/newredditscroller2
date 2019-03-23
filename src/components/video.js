import React, { Component } from "react";
let touches = 0;
class Video extends Component {
  state = {
    loaded: false
  };

  render() {
    const { src, poster, mobile } = this.props;
    console.log(touches);
    let havePoster = mobile && { poster: poster };

    return (
      <video
        autoFocus
        ref={el => (this.videoPlayer = el)}
        onClick={() => {
          this.videoPlayer.pause();
        }}
        onTouchMove={e => {
          touches = touches + 1;
          touches > 10 && this.videoPlayer.pause();
        }}
        onTouchStart={e => {
          touches = 0;
          console.log("start");
        }}
        onTouchEnd={e => {
          touches < 10 && this.videoPlayer.play();
          console.log("end");
        }}
        autoPlay={false}
        allowFullScreen={true}
        onCanPlay={() => console.log("loaded")}
        className={`video`}
        playsInline={true}
        onMouseOver={() => !mobile && this.videoPlayer.play()}
        onMouseLeave={() => !mobile && this.videoPlayer.pause()}
        loop={true}
        {...havePoster}
        preload={mobile ? "none" : "metadata"}
      >
        <source src={src} type="video/mp4" />
        Sorry, your browser doesn't support embedded videos.
      </video>
    );
  }
}

export default Video;
