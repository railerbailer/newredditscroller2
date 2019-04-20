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
  toggleIsDropDownShowing = value => {
    this.setState({ isDropDownShowing: value });
  };
  menu = () => {
    const { collections, src, className, poster, ratioClassName } = this.props;
    console.log(collections);
    const lists = Object.keys(collections).reverse();
    const listMenuItem = lists.map(list => (
      <Menu.Item
        key={list}
        onClick={() => {
          this.props.addMediaToCollection(
            { [className]: { className: ratioClassName, url: src, image: poster } },
            list
          );
          message.info(`Added to collection ${list}`);
          this.setState({ isDropDownShowing: false });
        }}
      >
        {list}
      </Menu.Item>
    ));
    return (
      <Menu>
        <h4 style={{ marginLeft: "4px" }}>
          <Icon type="bars" /> My collections
        </h4>
        {listMenuItem}
      </Menu>
    );
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
          onBlur={() => setTimeout((() => this.toggleIsDropDownShowing(false), 500))}
          overlayClassName="mediaAddDropdown"
          placement="topRight"
          visible={this.state.isDropDownShowing}
          overlay={this.menu()}
        >
          <Icon
            onClick={() => this.toggleIsDropDownShowing(!this.state.isDropDownShowing)}
            className="addNewMediaIcon"
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
