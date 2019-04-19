import React, { Component } from "react";
import { Icon, Dropdown, Menu, message } from "antd";
class Video extends Component {
  constructor() {
    super();
    this.timer = null;
    this.state = {
      videoLoaded: false,
      isPlaying: false,
      fadeOut: false,
      autoPlay: false,
      isDropDownShowing: false
    };
  }
  componentDidMount() {
    if (this.props.mobile && this.props.fullscreen) {
      this.togglePlaying();
    }
  }
  toggleIsDropDownShowing = () => {
    this.setState({ isDropDownShowing: !this.state.isDropDownShowing });
  };
  menu = () => {
    const { collections, src, className } = this.props;
    console.log(collections);
    const lists = Object.keys(collections).reverse();
    const listMenuItem = lists.map(list => (
      <Menu.Item
        key={list}
        onClick={() => {
          this.props.addMediaToCollection(className, src, list);
          this.toggleIsDropDownShowing();
          message.info(`Added to collection ${list}`);
        }}
      >
        {list}
      </Menu.Item>
    ));
    return <Menu>{listMenuItem}</Menu>;
  };

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
    const { src, fullscreen, toggleFullscreen, poster, mobile, index, className } = this.props;
    return (
      <React.Fragment>
        <video
          ref={el => (this.videoPlayer = el)}
          onClick={() => {
            toggleFullscreen(index);
            this.togglePlaying();
          }}
          autoPlay={!mobile && fullscreen}
          poster={mobile && poster}
          allowFullScreen={true}
          onCanPlay={() => this.setState({ videoLoaded: true })}
          className={className}
          playsInline={true}
          onPlay={() =>
            this.setState(
              { isPlaying: true, fadeOut: !this.state.fadeOut },
              () => !fullscreen && (this.timer = setTimeout(() => this.videoPlayer && this.videoPlayer.pause(), 25000))
            )
          }
          onPause={() => this.setState({ isPlaying: false }, clearTimeout(this.timer))}
          loop={true}
          preload={"metadata"}
        >
          {!mobile && <source src={`${src}#t=0.1`} type="video/mp4" />}
          <source src={src} type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>
        <Dropdown
          overlayClassName="mediaAddDropdown"
          placement="topRight"
          visible={this.state.isDropDownShowing}
          overlay={this.menu()}
        >
          <Icon
            onClick={this.toggleIsDropDownShowing}
            style={{
              position: "absolute",
              zIndex: 2,
              bottom: 5,
              left: 5,
              fontSize: 20,
              opacity: 0.8,
              color: "#1890ff",
              background: "white",
              borderRadius: "100%"
            }}
            type="plus-circle"
          />
        </Dropdown>
        {!this.state.isPlaying ? (
          <Icon className="playButton" type={"youtube"} onClick={() => this.togglePlaying()} />
        ) : !this.state.videoLoaded ? (
          <Icon className="playButton" type={"loading"} onClick={() => this.togglePlaying()} />
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
