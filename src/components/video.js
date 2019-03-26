import React, { Component } from "react";
import { Icon } from "antd";
class Video extends Component {
  state = {
    loaded: false,
    isPlaying: false
  };

  togglePlaying = () => {
    !this.props.fullscreen &&
      setTimeout(() => {
        if (this.videoPlayer) {
          this.videoPlayer.pause();
          this.setState({ isPlaying: false });
        }
      }, 30000);
    this.setState({ isPlaying: !this.state.isPlaying }, () =>
      this.state.isPlaying ? this.videoPlayer.play() : this.videoPlayer.pause()
    );
  };

  render() {
    const { src, poster, mobile } = this.props;

    let havePoster = mobile && { poster: poster };

    return (
      <React.Fragment>
        <video
          autoFocus
          ref={el => (this.videoPlayer = el)}
          onClick={() => this.togglePlaying()}
          onTouchMove={() => {
            this.setState({ isPlaying: false }, () => this.videoPlayer.pause());
          }}
          autoPlay={false}
          allowFullScreen={true}
          onCanPlay={() => this.setState({ loaded: true })}
          className={`video`}
          playsInline={true}
          onMouseOver={() =>
            !mobile &&
            this.setState({ isPlaying: true }, () => this.videoPlayer.play())
          }
          onMouseLeave={() =>
            !mobile &&
            this.setState({ isPlaying: false }, () => this.videoPlayer.pause())
          }
          loop={true}
          {...havePoster}
          preload={mobile ? "none" : "metadata"}
        >
          <source src={src} type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>
        {!this.state.isPlaying ? (
          <Icon
            className="playButton"
            type={"play-circle"}
            onClick={() => this.togglePlaying()}
          />
        ) : (
          !this.state.loaded && (
            <Icon
              className="playButton"
              type={"loading"}
              onClick={() => this.togglePlaying()}
            />
          )
        )}
      </React.Fragment>
    );
  }
}

export default Video;
