import React, { Component } from "react";
import { Spin, Icon } from "antd";
import LazyLoad from "react-lazyload";
import Image from "./image.js";
import Video from "./video.js";

let existsData = 0;
let html;
class AddMarkup extends Component {
  state = {
    showFullScreenIcon: false
  };

  componentWillUpdate() {
    if (this.props.addMore) this.props.setFullscreenArray(html);
  }

  componentDidMount() {
    const {} = this.props;
    console.log("addmarkupdidmount");
    this.props.setFullscreenArray(html);
  }

  render() {
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
              debounce={250}
              throttle={250}
              height={400}
              offset={mobile ? 5 : 2000}
              key={i}
            >
              <div
                key={i}
                ref={el => (this[`gridElement${i}`] = el)}
                className={`gridElement ${image.className}`}
                onMouseOver={() => this.setState({ showFullScreenIcon: true })}
                onMouseLeave={() =>
                  this.setState({ showFullScreenIcon: false })
                }
              >
                <Image
                  className="image"
                  key={`image${i}`}
                  fullscreen={fullscreen}
                  src={
                    (mobile && (image.low || image.high)) ||
                    image.source ||
                    image.source.replace("https", "http")
                  }
                />
                <div className="title-text">{title}</div>
                {(this.state.showFullScreenIcon || !fullscreen) && (
                  <Icon
                    className="fullscreenIcon"
                    type={fullscreen ? "shrink" : "arrows-alt"}
                    onClick={() => {
                      getElementIndex(jsx, i, this[`gridElement${i}`]);
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
              debounce={250}
              throttle={250}
              height={400}
              offset={mobile ? 5 : 2000}
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
                {(this.state.showFullScreenIcon || !fullscreen) && (
                  <Icon
                    className="fullscreenIcon"
                    type={fullscreen ? "shrink" : "arrows-alt"}
                    onClick={() => {
                      getElementIndex(jsx, i, this[`gridElement${i}`]);
                    }}
                  />
                )}
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
              debounce={250}
              throttle={250}
              height={400}
              offset={mobile ? 5 : 2000}
              key={i}
            >
              <div
                key={i}
                ref={el => (this[`gridElement${i}`] = el)}
                className={`gridElement ${gif.className}`}
              >
                <img className={`gif`} key={i} src={gif.url} />
                <div className="title-text">{title}</div>
                {(this.state.showFullScreenIcon || !fullscreen) && (
                  <Icon
                    className="fullscreenIcon"
                    type={fullscreen ? "shrink" : "arrows-alt"}
                    onClick={() => {
                      getElementIndex(jsx, i, this[`gridElement${i}`]);
                    }}
                  />
                )}
              </div>
            </LazyLoad>
          );
          return jsx;
        }
      })
      .filter(item => item);

    return html;
  }
}

export default AddMarkup;
