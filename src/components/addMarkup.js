import React, { Component } from "react";
import { Spin, Icon, Button } from "antd";
import LazyLoad from "react-lazyload";
import Image from "./image.js";
import Video from "./video.js";
import { throttle } from "lodash";
import Swipeable from "react-swipeable";

let html;
class AddMarkup extends Component {
  state = {
    showFullScreenIcon: true,
    html: [],
    activeElement: 0,
    loading: false,
    videoAutoPlay: false
  };
  componentWillMount() {
    this.renderHtml();
  }

  getElementIndex = async (index, ref) => {
    this.props.toggleFullscreen();
    this.setState(
      { activeElement: index },
      () =>
        this[`gridElement${this.state.index || index}`] &&
        this[`gridElement${this.state.index || index}`].scrollIntoView({
          block: "center"
        })
    );
  };

  getPreviousElement = throttle(() => {
    if (!this.state.activeElement) return;
    this.setState({ activeElement: this.state.activeElement - 1 });
  }, 100);

  getNextElement = throttle(async () => {
    const haveMoreContent = this.state.activeElement + 1 >= html.length;
    if (haveMoreContent) {
      if (!this.props.isLoadingMore) {
        try {
          await this.props.loadMore();
        } catch (error) {
          console.log("error", error);
        }
      }
      this.setState({
        activeElement: haveMoreContent
          ? this.state.activeElement + 1
          : this.state.activeElement
      });
      return;
    }

    this.setState({
      activeElement: this.state.activeElement + 1
    });
  }, 200);

  handleKeyDown = e => {
    if (e.key === "ArrowDown") {
      !this.props.isSearchActivated && this.getNextElement();
    }

    if (e.key === "s") {
      !this.props.isSearchActivated && this.getNextElement();
    }
    if (e.key === "w") {
      !this.props.isSearchActivated && this.getPreviousElement();
    }

    if (e.key === "ArrowUp") {
      !this.props.isSearchActivated && this.getPreviousElement();
    }
    if (e.key === " ") {
      if (this.videoPlayer) {
        this.videoPlayer.play();
      }
    }
  };

  swipedUp = (e, deltaY, isFlick) => {
    if (isFlick || deltaY > 75) {
      this.getNextElement();
    }
  };

  swipedDown = (e, deltaY, isFlick) => {
    if (isFlick || deltaY > 50) {
      this.getPreviousElement();
    }
  };
  render() {
    this.renderHtml();
    const { fullscreen, mobile, isLoadingMore } = this.props;
    return (
      <Swipeable
        onKeyDown={e => this.handleKeyDown(e)}
        onSwipedDown={this.swipedDown}
        onSwipedUp={this.swipedUp}
        style={{ backgroundColor: "rgb(20, 20, 20)" }}
      >
        {fullscreen ? (
          html.length && (
            <div className="fullscreenScroll">
              <Icon
                type="close"
                className="closeFullScreen"
                onClick={() => this.getElementIndex(this.state.activeElement)}
              />

              <div
                style={{ zIndex: isLoadingMore ? 10 : fullscreen ? 1 : 0 }}
                className="loadingMoreSpinner"
              >
                <svg xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill="#FFF"
                    d="M45.6,16.9l0-11.4c0-3-1.5-5.5-4.5-5.5L3.5,0C0.5,0,0,1.5,0,4.5l0,13.4c0,3,0.5,4.5,3.5,4.5l37.6,0
    C44.1,22.4,45.6,19.9,45.6,16.9z M31.9,21.4l-23.3,0l2.2-2.6l14.1,0L31.9,21.4z M34.2,21c-3.8-1-7.3-3.1-7.3-3.1l0-13.4l7.3-3.1
    C34.2,1.4,37.1,11.9,34.2,21z M6.9,1.5c0-0.9,2.3,3.1,2.3,3.1l0,13.4c0,0-0.7,1.5-2.3,3.1C5.8,19.3,5.1,5.8,6.9,1.5z M24.9,3.9
    l-14.1,0L8.6,1.3l23.3,0L24.9,3.9z"
                  />
                </svg>
              </div>

              {html[this.state.activeElement]}
              <div style={{ opacity: 1, height: "1px" }}>
                {html[this.state.activeElement + 1]}
                {(!mobile || this.state.activeElement > 2) &&
                  html[this.state.activeElement + 2]}
                {(!mobile || this.state.activeElement > 9) &&
                  html[this.state.activeElement + 3]}
              </div>
              <div>
                <Icon
                  autoFocus
                  type="up"
                  className="fullscreenButtonNext"
                  onClick={() => this.getNextElement()}
                >
                  Show more
                </Icon>
              </div>
              {!this.props.isSearchActivated && (
                <button
                  className="inputFocus"
                  ref={button =>
                    button && !this.state.isSearchActivated && button.focus()
                  }
                />
              )}
            </div>
          )
        ) : (
          <div className="gridMedia">{html}</div>
        )}
        {!fullscreen && (
          <div className="loadMoreWrapper">
            {!this.props.isLoading && html.length && (
              <Button
                onClick={async () => {
                  try {
                    await this.props.loadMore();
                  } catch (error) {
                    console.log("error", error);
                  }
                  setTimeout(
                    () => this.setState({ loading: true }, this.renderHtml()),
                    500
                  );
                }}
                type="primary"
                icon={
                  this.props.isLoadingMore ? "loading" : "loading-3-quarters"
                }
                className="loadMoreButton"
              >
                Load more
              </Button>
            )}
          </div>
        )}
      </Swipeable>
    );
  }

  renderHtml = () => {
    const {
      isOnlyPicsShowing,
      isOnlyGifsShowing,
      mobile,
      fullscreen,
      dataSource
    } = this.props;
    let filteredData;
    if (mobile) filteredData = dataSource.filter(item => !item.gif);
    if (isOnlyPicsShowing)
      filteredData = dataSource
        .filter(item => !item.video)
        .filter(item => !item.gif);
    else if (isOnlyGifsShowing)
      filteredData = dataSource.filter(item => !item.image);
    else if (isOnlyPicsShowing && isOnlyGifsShowing) filteredData = dataSource;
    else filteredData = dataSource;
    html = filteredData
      .filter(item => Object.entries(item).length !== 0)
      .map((data, i) => {
        const { gif, image, video, title, thumbnail } = data;
        const size = {
          superTall: 645,
          veryTall: 645,
          rectangular: 385,
          superWide: 255,
          veryWide: 255
        };
        if (image) {
          return (
            <div
              key={i}
              ref={el => (this[`gridElement${i}`] = el)}
              className={`gridElement ${image.className}`}
              onClick={() => {
                this.getElementIndex(i, this[`gridElement${i}`]);
              }}
            >
              <LazyLoad
                unmountIfInvisible={true}
    //             placeholder={
    //               <div style={{ height: `${size[image.className]}px` }}>
    //                 <svg xmlns="http://www.w3.org/2000/svg">
    //                   <path
    //                     fill="#FFF"
    //                     d="M45.6,16.9l0-11.4c0-3-1.5-5.5-4.5-5.5L3.5,0C0.5,0,0,1.5,0,4.5l0,13.4c0,3,0.5,4.5,3.5,4.5l37.6,0
    // C44.1,22.4,45.6,19.9,45.6,16.9z M31.9,21.4l-23.3,0l2.2-2.6l14.1,0L31.9,21.4z M34.2,21c-3.8-1-7.3-3.1-7.3-3.1l0-13.4l7.3-3.1
    // C34.2,1.4,37.1,11.9,34.2,21z M6.9,1.5c0-0.9,2.3,3.1,2.3,3.1l0,13.4c0,0-0.7,1.5-2.3,3.1C5.8,19.3,5.1,5.8,6.9,1.5z M24.9,3.9
    // l-14.1,0L8.6,1.3l23.3,0L24.9,3.9z"
    //                   />
    //                 </svg>
    //               </div>
    //             }
                height={size[image.className]}
                offset={mobile ? 1000 : 1200}
                throttle={250}
                key={i}
              >
                <Image
                  className="image"
                  key={`image${i}`}
                  fullscreen={fullscreen}
                  src={
                    mobile
                      ? image.low || image.high
                      : image.high || image.low || image.source
                  }
                />
              </LazyLoad>
            </div>
          );
        }
        if (video) {
          return (
            <div
              key={i}
              ref={el => (this[`gridElement${i}`] = el)}
              className={`gridElement ${video.className}`}
            >
              <LazyLoad
                unmountIfInvisible={true}
                placeholder={
                  <Spin
                    style={{
                      height: `${size[video.className]}px`
                    }}
                  />
                }
                throttle={250}
                height={size[video.className]}
                offset={mobile ? 800 : 1400}
                key={i}
              >
                <Video
                  onClick={() => {
                    this.getElementIndex(i, this[`gridElement${i}`]);
                  }}
                  key={`video${i}`}
                  mobile={mobile}
                  src={video.url}
                  videoAutoPlay={fullscreen}
                  poster={video.image || thumbnail}
                />
              </LazyLoad>
            </div>
          );
        }
        if (gif && !mobile) {
          return (
            <div
              key={i}
              ref={el => (this[`gridElement${i}`] = el)}
              className={`gridElement ${gif.className}`}
              onClick={() => {
                this.getElementIndex(i, this[`gridElement${i}`]);
              }}
            >
              <LazyLoad
                unmountIfInvisible={true}
                placeholder={
                  <Spin
                    style={{
                      height: `${size[gif.className]}px`
                    }}
                  />
                }
                throttle={250}
                height={size[gif.className]}
                offset={mobile ? 800 : 1400}
                key={i}
              >
                <Image className={`gif`} src={gif.url} />
              </LazyLoad>
            </div>
          );
        }
      });
  };
}

export default AddMarkup;
