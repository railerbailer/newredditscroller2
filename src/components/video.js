import React, { Component } from "react";
import { Icon } from "antd";
class Video extends Component {
  constructor() {
    super();
    this.timer = null;
    this.state = {
      videoLoaded: false,
      isPlaying: false,
      fadeOut: false,
      autoPlay: false,
    };
  }
  componentDidMount(){
    if(this.props.mobile && this.props.videoAutoPlay){
      this.togglePlaying();
    }
  }

  togglePlaying = () => {
    if (this.videoPlayer) {
      this.videoPlayer.pause();
      this.setState({ isPlaying: false, fadeOut: false });
    }

    this.setState({ isPlaying: !this.state.isPlaying }, () =>
      this.state.isPlaying ? this.videoPlayer.play() : this.videoPlayer.pause()
    );
  };

  render() {
    const { src, videoAutoPlay, onClick, poster, mobile } = this.props;
    return (
      <React.Fragment>
        <video
          ref={el => (this.videoPlayer = el)}
          onClick={() => {
            onClick();
            this.togglePlaying();
          }}
          autoPlay={!mobile && videoAutoPlay}
          poster={mobile && poster}
          allowFullScreen={true}
          onCanPlay={() => this.setState({ videoLoaded: true })}
          className={`video`}
          playsInline={true}
          onPlay={() =>
            this.setState(
              { isPlaying: true, fadeOut: !this.state.fadeOut },
              () =>
                (this.timer = setTimeout(
                  () => this.videoPlayer && this.videoPlayer.pause(),
                  25000
                ))
            )
          }
          onPause={() =>
            this.setState({ isPlaying: false }, clearTimeout(this.timer))
          }
          loop={true}
          preload={"metadata"}
        >
          {!mobile &&<source src={`${src}#t=0.1`} type="video/mp4" />}
          <source src={src} type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>
        {!this.state.isPlaying ? (
          <Icon
            className="playButton"
            type={"youtube"}
            onClick={() => this.togglePlaying()}
          />
        ) : !this.state.videoLoaded ? (
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
              transition: "opacity 1000ms"
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
