import React, { Component } from "react";
import { Icon } from "antd";
class Video extends Component {
  state = {
    loaded: false,
    isPlaying: false,
    fadeOut: false
  };

  togglePlaying = () => {
    if (this.videoPlayer) {
      this.videoPlayer.pause();
      this.setState({ isPlaying: false, fadeOut: !this.state.fadeOut });
    }
    
    this.setState({ isPlaying: !this.state.isPlaying }, () =>
      this.state.isPlaying ? this.videoPlayer.play() : this.videoPlayer.pause()
    );
  };

  render() {
    const { src, poster, mobile, fullscreen, onClick } = this.props;

    let havePoster = mobile && { poster: poster };

    return (
      <React.Fragment>
        <video
          autoFocus
          ref={el => (this.videoPlayer = el)}
          onClick={() => {
            onClick();
          }}
          onTouchMove={() => {
            this.setState({ isPlaying: false }, () => this.videoPlayer.pause());
          }}
          autoPlay={false}
          allowFullScreen={true}
          onCanPlay={() => this.setState({ loaded: true })}
          className={`video`}
          playsInline={true}
          onMouseOver={() => !mobile && this.togglePlaying()}
          onMouseLeave={() => !mobile && this.togglePlaying()}
          /*   onMouseLeave={() =>
            !mobile &&
            this.setState({ isPlaying: false }, () => this.videoPlayer.pause())
          } */
          loop={true}
          /*  {...havePoster} */
          preload={"metadata"}
        >
          <source src={`${src}#t=0.5`} type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>
        {!this.state.isPlaying ? (
          <Icon
            className="playButton"
        
            type={"youtube"}
            onClick={() => this.togglePlaying()}
          />
        ) : !this.state.loaded ? (
          <Icon
            className="playButton"
            type={"loading"}
            onClick={() => this.togglePlaying()}
          />
        ) : (
          <Icon
            className="playButton"
            style={{
              opacity: this.state.fadeOut ? 0 : 1,
              transition: "opacity 1000ms",
            }}
            type={"pause"}
            onClick={() => this.togglePlaying()}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Video;
