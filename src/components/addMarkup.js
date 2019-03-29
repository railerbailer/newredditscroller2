import React, { Component } from "react";
import { Spin, Icon, message, Button } from "antd";
import LazyLoad from "react-lazyload";
import Image from "./image.js";
import Video from "./video.js";
import { debounce, throttle } from "lodash";

let existsData = 0;
let html;
class AddMarkup extends Component {
  state = {
    showFullScreenIcon: true,
    html: [],
    activeElement: 0,
    loading: false
  };
  componentWillMount() {
    this.renderHtml();
  }
  componentDidMount() {
/*         window.addEventListener("scroll", this.handleScroll);
 */     console.log("Mounting addMarkup", html);
    this.renderHtml();
  }

/*     handleScroll = () => {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + 800 + window.pageYOffset;
    if (windowBottom >= docHeight) {
      this.props.loadMore();
      setTimeout(()=>this.setState({loading: true},this.renderHtml()), 3000);
    }
  };
 */
  getElementIndex = (element, index, ref) => {
    this.props.toggleFullscreen();
    this.setState(
      {
        activeElement: index
      },
      () => ref && ref.scrollIntoView() //window.scrollTo(0, 430 * index)
    );
  };

  getPreviousElement = throttle(() => {
    if (!this.state.activeElement) return;
    this.setState({ activeElement: this.state.activeElement - 1 });
  }, 100);

  getNextElement = throttle(async () => {
    const haveMoreContent = this.state.activeElement + 1 >= html.length;
    if (haveMoreContent) {
      !this.props.isLoadingMore && (await this.props.loadMore());
      this.renderHtml();
      this.setState({
        activeElement: haveMoreContent
          ? this.state.activeElement + 1
          : this.state.activeElement
      });
      return;
    }

    console.log(this.state.activeElement);
    this.setState({
      activeElement: this.state.activeElement + 1
    });
  }, 100);

  render() {
    const { fullscreen } = this.props;

    return fullscreen && html.length > this.props.activeElement ? (
      html.length ? (
        <div className="fullscreenScroll">
          {html[this.state.activeElement]}
          {/* <div style={{ height: "0px" }}>
            {html[this.state.activeElement + 1]}
            {html[this.state.activeElement + 2]}
            {html[this.state.activeElement + 3]}
          </div> */}
          <Icon
            autoFocus
            style={{ backgroundColor: "red" }}
            type="caret-down"
            className="fullscreenButtonNext"
            onClick={() => this.getNextElement()}
          />
        </div>
      ) : (
        "what"
      )
    ) : (
      <div className="gridMedia">
        {html}
        <div className="loadMoreWrapper">
                {this.props.isLoadingMore ? (
                  <Spin style={{ margin: "auto", display: "block" }} />
                ) : (
                  !this.props.isLoading && (
                    <Button
                      onClick={() => {
                        this.props.loadMore();
                        setTimeout(()=>this.setState({loading: true},this.renderHtml()), 3000);
                      }}
                      type="primary"
                      icon="download"
                      className="loadMoreButton"
                    >
                      Load more
                    </Button>
                  )
                )}
              </div>
      </div>
    );
  }

  renderHtml = () => {
    const {
      isOnlyPicsShowing,
      isOnlyGifsShowing,
      mobile,
      fullscreen,
      dataSource,
      getElementIndex
    } = this.props;

    html = dataSource
      .filter(item => Object.entries(item).length !== 0)
      .map((data, i) => {
        const { gif, image, video, title } = data;
        if (
          image &&
          (!isOnlyGifsShowing || (isOnlyGifsShowing && isOnlyPicsShowing))
        ) {
          existsData = existsData + 1;
          let jsx = (
            <LazyLoad
              placeholder={
                <Spin
                  style={{
                    height: "400px"
                  }}
                />
              }
              height={400}
              offset={mobile ? 800 : 2000}
              key={i}
            >
              <div
                key={i}
                ref={el => (this[`gridElement${i}`] = el)}
                className={`gridElement ${image.className}`}
              >
                <Image
                  className="image"
                  key={`image${i}`}
                  fullscreen={fullscreen}
                  onClick={() => {
                    this.getElementIndex(jsx, i, this[`gridElement${i}`]);
                  }}
                  src={
                    (mobile && (image.low || image.high)) ||
                    image.source ||
                    image.source.replace("https", "http")
                  }
                />
                <div className="title-text">{title}</div>
                <Icon
                  className="fullscreenIcon"
                  type={fullscreen ? "shrink" : "arrows-alt"}
                  onClick={() => {
                    this.getElementIndex(jsx, i, this[`gridElement${i}`]);
                  }}
                />
                )}
              </div>
            </LazyLoad>
          );

          return jsx;
        }
        if (
          video &&
          (!isOnlyPicsShowing || (isOnlyGifsShowing && isOnlyPicsShowing))
        ) {
          existsData = existsData + 1;
          let jsx = (
            <LazyLoad
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
                  key={`video${i}`}
                  mobile={mobile}
                  src={video.url}
                  fullscreen={fullscreen}
                  poster={video.image ? video.image : data.thumbnail}
                />

                <div className="title-text">{title}</div>
                {
                  <Icon
                    className="fullscreenIcon"
                    type={fullscreen ? "shrink" : "arrows-alt"}
                    onClick={() => {
                      this.getElementIndex(jsx, i, this[`gridElement${i}`]);
                    }}
                  />
                }
              </div>
            </LazyLoad>
          );
          return jsx;
        }
        if (
          gif &&
          (!isOnlyPicsShowing || (isOnlyGifsShowing && isOnlyPicsShowing))
        ) {
          existsData = existsData + 1;
          const jsx = (
            <LazyLoad
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
              >
                <img className={`gif`} key={i} src={gif.url} />
                <div className="title-text">{title}</div>
                <Icon
                  className="fullscreenIcon"
                  type={fullscreen ? "shrink" : "arrows-alt"}
                  onClick={() => {
                    this.getElementIndex(jsx, i, this[`gridElement${i}`]);
                  }}
                />
                )}
              </div>
            </LazyLoad>
          );
          return jsx;
        }
      });
  };
}

export default AddMarkup;
