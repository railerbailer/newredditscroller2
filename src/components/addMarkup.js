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

  getElementIndex = (index, ref) => {
    this.props.toggleFullscreen();

    this.setState({activeElement: index},
      () => ref && ref.scrollIntoView({ block: "center" }) //window.scrollTo(0, 430 * index)
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
    const { fullscreen, mobile } = this.props;
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
                onClick={() => this.props.toggleFullscreen()}
              />
              {html[this.state.activeElement]}
              <div style={{ height: "0px" }}>
                {html[this.state.activeElement + 1]}
                {!mobile && html[this.state.activeElement + 2]}
                {!mobile && html[this.state.activeElement + 3]}
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
        const { gif, image, video, title } = data;
        if (image) {
          return (
            <LazyLoad
              placeholder={
                <Spin
                  style={{
                    height: "400px"
                  }}
                />
              }
              unmountIfInvisible={false}
              height={400}
              offset={mobile ? 800 : 2000}
              key={i}
            >
              <div
                key={i}
                ref={el => (this[`gridElement${i}`] = el)}
                className={`gridElement ${image.className}`}
                onClick={() => {
                  this.getElementIndex(i, this[`gridElement${i}`]);
                }}
              >
                <Image
                  className="image"
                  key={`image${i}`}
                  fullscreen={fullscreen}
                  src={mobile ? image.low : image.high ? image.high : image.low}
                />
               
              </div>
            </LazyLoad>
          );
        }
        if (video) {
          return (
            <LazyLoad
              unmountIfInvisible={true}
              placeholder={
                <Spin
                  style={{
                    height: "400px"
                  }}
                />
              }
              throttle={250}
              height={400}
              offset={mobile ? 800 : 2000}
              key={i}
            >
              <div
                key={i}
                ref={el => (this[`gridElement${i}`] = el)}
                className={`gridElement ${video.className}`}
              >
                <Video
                  onClick={() => {
                    this.getElementIndex(i, this[`gridElement${i}`]);
                  }}
                  key={`video${i}`}
                  mobile={mobile}
                  src={video.url}
                  videoAutoPlay={fullscreen}
                  poster={video.image ? video.image : data.thumbnail}
                />
              </div>
            </LazyLoad>
          );
        }
        if (gif && !mobile) {
          return (
            <LazyLoad
              unmountIfInvisible={false}
              placeholder={
                <Spin
                  style={{
                    height: "400px"
                  }}
                />
              }
              throttle={250}
              height={400}
              offset={mobile ? 800 : 2000}
              key={i}
            >
              <div
                key={i}
                ref={el => (this[`gridElement${i}`] = el)}
                className={`gridElement ${gif.className}`}
                onClick={() => {
                  this.getElementIndex(i, this[`gridElement${i}`]);
                }}
              >
                <Image className={`gif`} src={gif.url} />
              
              </div>
            </LazyLoad>
          );
        }
      });
  };
}

export default AddMarkup;
