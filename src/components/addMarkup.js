import React, { useState, useEffect } from "react";
import { Icon, Button } from "antd";
import LazyLoad from "react-lazyload";
import Image from "./image";
import Video from "./video";
import { throttle } from "lodash";
import Swipeable from "react-swipeable";
import { carPath } from "../utils/carPath";
let html = [];
const AddMarkup = props => {
  // const [html, setHtml] = useState([]);
  const [activeElement, setActiveElement] = useState(0);
  const { collectionsMode, activeCollection, isLoading } = props;
  useEffect(() => {
    this[`gridElement${activeElement}`] &&
      this[`gridElement${activeElement}`].scrollIntoView({
        block: "center"
      });
  }, [!props.fullscreen]);
  const { collections } = props;

  const getElementIndex = (index, ref) => {
    setActiveElement(index);
    props.toggleFullscreen();
  };

  const getPreviousElement = throttle(() => {
    if (!activeElement) return;
    setActiveElement(activeElement - 1);
  }, 100);
  const getNextElement = throttle(async () => {
    const haveMoreContent = activeElement + 1 >= html.length;
    if (!props.activeCollection.length && haveMoreContent) {
      if (!props.isLoadingMore) {
        try {
          await props.loadMore();
        } catch (error) {
          console.log("error", error);
        }
      }
      setActiveElement(haveMoreContent ? activeElement + 1 : activeElement);

      return;
    }
    html.length !== activeElement + 1 && setActiveElement(activeElement + 1);
  }, 200);
  const handleKeyDown = e => {
    if (e.key === "ArrowDown") {
      !props.isSearchActivated && getNextElement();
    }

    if (e.key === "s") {
      !props.isSearchActivated && getNextElement();
    }
    if (e.key === "w") {
      !props.isSearchActivated && getPreviousElement();
    }

    if (e.key === "ArrowUp") {
      !props.isSearchActivated && getPreviousElement();
    }
    if (e.key === " ") {
      if (this.videoPlayer) {
        this.videoPlayer.play();
      }
    }
  };

  const swipedUp = (e, deltaY, isFlick) => {
    if (isFlick || deltaY > 75) {
      getNextElement();
    }
  };
  const getIdFromUrl = url => {
    return url.match(/(?<=.[a-z]\/)([^\.].*?)(?=[\.|\/])/g).join("");
  };
  const swipedDown = (e, deltaY, isFlick) => {
    if (isFlick || deltaY > 50) {
      getPreviousElement();
    }
  };
  const renderHtml = () => {
    const { isOnlyPicsShowing, isOnlyGifsShowing, mobile, fullscreen, dataSource } = props;
    let filteredData;
    if (mobile) filteredData = dataSource.filter(item => !item.gif);
    if (isOnlyPicsShowing) filteredData = dataSource.filter(item => !item.video).filter(item => !item.gif);
    else if (isOnlyGifsShowing) filteredData = dataSource.filter(item => !item.image);
    else if (isOnlyPicsShowing && isOnlyGifsShowing) filteredData = dataSource;
    else filteredData = dataSource;
    html = filteredData
      .filter(item => Object.entries(item).length !== 0)
      .map((data, i) => {
        const { gif, image, video, thumbnail } = data;
        const size = {
          superTall: 645,
          veryTall: 645,
          rectangular: 385,
          superWide: 255,
          veryWide: 255
        };
        if (image) {
          const source = mobile
            ? image.low || image.high || thumbnail
            : image.high || image.low || image.source || thumbnail;
          const imageId = getIdFromUrl(source);
          return (
            <div
              key={i}
              ref={el => (this[`gridElement${i}`] = el)}
              className={`gridElement pics ${image.className}`}
              onClick={() => {
                fullscreen && getElementIndex(i, this[`gridElement${i}`]);
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
                offset={mobile ? 800 : 1200}
                throttle={250}
                key={i}
              >
                <Image
                  firebaseId={imageId}
                  toggleIsModalVisible={props.toggleIsModalVisible}
                  ratioClassName={image.className}
                  index={i}
                  toggleFullscreen={getElementIndex}
                  addMediaToCollection={props.addMediaToCollection}
                  collections={collections}
                  className="image"
                  key={`image${i}`}
                  fullscreen={fullscreen}
                  src={source}
                />
              </LazyLoad>
            </div>
          );
        }
        if (video) {
          const videoId = getIdFromUrl(video.url);
          return (
            <div
              onClick={() => {
                fullscreen && getElementIndex(i, this[`gridElement${i}`]);
              }}
              key={i}
              ref={el => (this[`gridElement${i}`] = el)}
              className={`gridElement gifs ${video.className}`}
            >
              <LazyLoad
                unmountIfInvisible={true}
                // placeholder={
                //   <Spin
                //     style={{
                //       height: `${size[video.className]}px`
                //     }}
                //   />
                // }
                throttle={250}
                height={size[video.className]}
                offset={mobile ? 800 : 1400}
                key={i}
              >
                <Video
                  firebaseId={videoId}
                  toggleIsModalVisible={props.toggleIsModalVisible}
                  className="video"
                  ratioClassName={video.className}
                  index={i}
                  toggleFullscreen={getElementIndex}
                  addMediaToCollection={props.addMediaToCollection}
                  collections={collections}
                  key={`video${i}`}
                  mobile={mobile}
                  src={video.url}
                  fullscreen={fullscreen}
                  poster={video.image || thumbnail}
                />
              </LazyLoad>
            </div>
          );
        }
        if (gif && !mobile) {
          const gifId = getIdFromUrl(gif.url);
          return (
            <div
              key={i}
              ref={el => (this[`gridElement${i}`] = el)}
              className={`gridElement gifs ${gif.className}`}
              onClick={() => {
                fullscreen && getElementIndex(i, this[`gridElement${i}`]);
              }}
            >
              <LazyLoad
                unmountIfInvisible={true}
                // placeholder={
                //   <Spin
                //     style={{
                //       height: `${size[gif.className]}px`
                //     }}
                //   />
                // }
                throttle={250}
                height={size[gif.className]}
                offset={mobile ? 800 : 1400}
                key={i}
              >
                <Image
                  firebaseId={gifId}
                  toggleIsModalVisible={props.toggleIsModalVisible}
                  ratioClassName={gif.className}
                  index={i}
                  toggleFullscreen={getElementIndex}
                  addMediaToCollection={props.addMediaToCollection}
                  collections={collections}
                  className={`gif`}
                  src={gif.url}
                />
              </LazyLoad>
            </div>
          );
        }
        return null;
      });
  };
  const { fullscreen, mobile, isLoadingMore } = props;
  renderHtml();
  return (
    <Swipeable
      onKeyDown={e => handleKeyDown(e)}
      onSwipedDown={swipedDown}
      onSwipedUp={swipedUp}
      style={{ backgroundColor: "rgb(20, 20, 20)" }}
    >
      {fullscreen ? (
        html.length && (
          <div className="fullscreenScroll">
            <Icon type="close" className="closeFullScreen" onClick={() => getElementIndex(activeElement)} />

            <div style={{ zIndex: isLoadingMore ? 10 : fullscreen ? 1 : 0 }} className="loadingMoreSpinner">
              <svg xmlns="http://www.w3.org/2000/svg">
                <path fill="#FFF" d={carPath} />
              </svg>
            </div>

            {html[activeElement]}
            <div style={{ opacity: 1, height: "1px" }}>
              {html[activeElement + 1]}
              {(!mobile || activeElement > 2) && html[activeElement + 2]}
              {(!mobile || activeElement > 9) && html[activeElement + 3]}
            </div>
            <div className="fullscreenButtonNext">
              <Icon autoFocus type="up" className="fullscreenButtonNext" onClick={() => getNextElement()} />
              <span>Show more</span>
            </div>
            {!props.isSearchActivated && <button className="inputFocus" ref={button => button && button.focus()} />}
          </div>
        )
      ) : (
        <div className="gridMedia">{html}</div>
      )}
      {!fullscreen && (
        <div className="loadMoreWrapper">
          {!collectionsMode && !activeCollection.length && !isLoading && html.length && (
            <Button
              onClick={async () => {
                try {
                  await props.loadMore();
                } catch (error) {
                  console.log("error", error);
                }
                renderHtml();
              }}
              type="primary"
              icon={props.isLoadingMore ? "loading" : "loading-3-quarters"}
              className="loadMoreButton"
            >
              Load more
            </Button>
          )}
        </div>
      )}
    </Swipeable>
  );
};

export default AddMarkup;
