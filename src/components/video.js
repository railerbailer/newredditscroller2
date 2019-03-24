import React, { Component } from "react";
import { Icon } from "antd";
let touches = 0;
class Video extends Component {
  state = {
    loaded: false,
    isPlaying: true
  };

  render() {
    const { src, poster, mobile } = this.props;
    
    let havePoster = mobile && { poster: poster };

    return (
      <React.Fragment>
        <video
          autoFocus
          ref={el => (this.videoPlayer = el)}
          onClick={() => {
            this.setState({ isPlaying: !this.state.isPlaying }, () =>
              this.state.isPlaying
                ? this.videoPlayer.pause()
                : this.videoPlayer.play()
            );
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
          onMouseOver={() =>
            !mobile &&
            this.setState({ isPlaying: false }, ()=> this.videoPlayer.play())
          }
          onMouseLeave={() =>
            !mobile &&
            this.setState({ isPlaying: true }, () => this.videoPlayer.pause())
          }
          loop={true}
          {...havePoster}
          preload={mobile ? "none" : "metadata"}
        >
          <source src={src} type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>
        {this.state.isPlaying && (
          <Icon
            className="playButton"
            type={"play-circle"}
            onClick={() => {
              this.setState({ isPlaying: !this.state.isPlaying }, () =>
                this.state.isPlaying
                  ? this.videoPlayer.pause()
                  : this.videoPlayer.play()
              );
            }}
          />
        )}
      </React.Fragment>
    );
  }
}

export default Video;
