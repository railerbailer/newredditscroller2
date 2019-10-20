import React, { Component } from "react";
import { Icon, Dropdown, Menu, message } from "antd";
import LazyLoad from "react-lazyload";
class Video extends Component {
  constructor() {
    super();
    this.timer = null;
    this.state = {
      videoLoaded: false,
      isPlaying: false,
      fadeOut: false,
      isDropDownShowing: false
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.fullscreen !== prevProps.fullscreen) {
      !this.props.fullscreen
        ? this.videoPlayer && this.videoPlayer.pause()
        : this.videoPlayer && this.videoPlayer.play();
    }
    if (
      this.props.fullscreen &&
      this.props.activeElement !== prevProps.activeElement
    ) {
      console.log("UPDATING VIDEO");
      this.videoPlayer && this.videoPlayer.play();
    }
  }
  componentDidMount() {
    this.props.fullscreen &&
      this.props.activeElement === 0 &&
      setTimeout(() => this.videoPlayer && this.videoPlayer.play(), 1000);
  }
  componentWillUnmount() {
    window.stop();
  }
  toggleIsDropDownShowing = value => {
    this.setState({ isDropDownShowing: value });
  };
  menu = () => {
    const {
      collections,
      src,
      className,
      poster,
      ratioClassName,
      firebaseId,
      permalink,
      title
    } = this.props;
    const lists = Object.keys(collections).reverse();
    const listMenuItem = lists.map(list => (
      <Menu.Item
        key={list}
        onClick={() => {
          this.props.addMediaToCollection(
            {
              [firebaseId]: {
                title: title || null,
                permalink: permalink || null,
                [className]: {
                  className: ratioClassName,
                  url: src,
                  image: poster
                }
              }
            },
            list
          );
          message.info(`Added to collection ${list}`);
          this.setState({ isDropDownShowing: false });
        }}
      >
        <Icon type="save" />
        {list}
      </Menu.Item>
    ));
    return (
      <Menu>
        <h4 className="addToCollectionModal">
          <Icon type="bank" /> <span>Add to bank</span>
          <Icon
            style={{
              float: "right",
              fontSize: 20,
              padding: "2px 10px 10px 15px"
            }}
            onClick={() => this.setState({ isDropDownShowing: false })}
            type="close"
          />
        </h4>
        {listMenuItem}
      </Menu>
    );
  };

  togglePlaying = () => {
    console.log("toggle playing");
    if (this.videoPlayer) {
      this.videoPlayer.pause();
      this.setState({ isPlaying: false, fadeOut: false });
    }

    this.setState({ isPlaying: !this.state.isPlaying }, () =>
      this.state.isPlaying ? this.videoPlayer.play() : this.videoPlayer.pause()
    );
  };

  render() {
    const {
      src,
      fullscreen,
      toggleFullscreen,
      poster,
      mobile,
      index,
      className,
      setLoadedData,
      loadedData,
      permalink,
      height
    } = this.props;
    const srcWithoutDash = src.split("DASH")[0];
    return (
      <LazyLoad
        unmountIfInvisible={true}
        height={height}
        offset={1400}
        key={index}
        debounce={0}
        throttle={0}
      >
        <video
          muted
          onLoadedMetadata={() => setLoadedData(loadedData + 2)}
          ref={el => (this.videoPlayer = el)}
          onClick={() => {
            toggleFullscreen(index);
            if (fullscreen) {
              this.setState({ isPlaying: false }, () =>
                this.videoPlayer.pause()
              );
            } else if (!fullscreen) {
              this.setState({ isPlaying: true }, () => this.videoPlayer.play());
            }
            // (this.state.isPlaying && fullscreen) ||
            //   (!this.state.isPlaying && !fullscreen && this.togglePlaying());
            // this.toggleIsDropDownShowing(false);
          }}
          poster={poster || undefined}
          allowFullScreen={true}
          onCanPlay={() => this.setState({ videoLoaded: true })}
          className={className}
          playsInline={true}
          onPlay={() =>
            this.setState(
              { isPlaying: true, fadeOut: !this.state.fadeOut },
              () =>
                !fullscreen &&
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
          {!mobile && (
            <source src={`${srcWithoutDash}DASH_720`} type="video/mp4" />
          )}
          {<source src={`${srcWithoutDash}DASH_600_K`} type="video/mp4" />}
          {<source src={`${srcWithoutDash}DASH_480`} type="video/mp4" />}
          {<source src={`${srcWithoutDash}DASH_360`} type="video/mp4" />}
          <source src={src} type="video/mp4" />
          Sorry, your browser doesn't support embedded videos.
        </video>
        {permalink && (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={permalink}
            style={{ zIndex: fullscreen ? 999 : 5 }}
            className="linkToSource"
          >
            <Icon style={{ zIndex: fullscreen ? 999 : 5 }} type="link" />
          </a>
        )}
        <Dropdown
          overlayStyle={{
            zIndex: fullscreen ? 1231231231231231 : 2,
            minWidth: "200px"
          }}
          onBlur={() =>
            setTimeout((() => this.toggleIsDropDownShowing(false), 500))
          }
          overlayClassName="mediaAddDropdown"
          placement="topRight"
          visible={this.state.isDropDownShowing}
          overlay={this.menu()}
        >
          <div
            style={{ zIndex: fullscreen ? 1231231231231231 : 2 }}
            onClick={() =>
              this.toggleIsDropDownShowing(!this.state.isDropDownShowing)
            }
            className="addNewMediaIcon"
            onBlur={() => this.toggleIsDropDownShowing(false)}
          >
            <Icon
              style={{ zIndex: fullscreen ? 1231231231231231 : 2 }}
              className="addNewMediaIcon"
              type={this.state.isDropDownShowing ? "up" : "bank"}
            />
          </div>
        </Dropdown>
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
      </LazyLoad>
    );
  }
}

export default Video;
