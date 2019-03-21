import React, { Component } from "react";
import Swipeable from "react-swipeable";
import "antd/dist/antd.css";
import { debounce } from "lodash";
import { Transition } from "react-transition-group";
import LazyLoad from "react-lazyload";
import ReactDOM from "react-dom";
import Iframe from "react-iframe";

import {
  Icon,
  Button,
  Spin,
  message,
  notification,
  Menu,
  Dropdown,
  AutoComplete,
  Switch
} from "antd";

import {
  subredditArray,
  straight,
  artArray,
  foodArray,
  animalsArray
} from "../subreddits";
import "../App.css";
let sources = [];
let htmlAndSource = [];
let goBack = [];
let goBackIndex = 0;
let heart = [];
let elementIndex = 0;
class Scroller extends Component {
  constructor(props) {
    super(props);
    React.CreateRef = this.renderFocus = React.createRef();

    this.state = {
      isLoadingMore: false,
      fullscreenActive: false,
      elementIndex: null,
      scrollHeight: 0,
      subredditData: [],
      isDropDownShowing: false,
      isLoading: false,
      isOnlyGifsShowing: false,
      isOnlyPicsShowing: false,
      isSearchActivated: false,
      dataSource: [],
      isHeartModeOn: false,
      heart: ["1", "2"],
      urls: [],
      loop: true,
      autoPlay: true,
      sliderData: [],
      subreddit: "",
      activeSlide: 0,
      activeSlide2: 0,
      looper: false,
      visibility: true,
      visibleBackLeft: false,
      alreadyChecked: false,
      spinning: true,
      underage: true,
      isLoadingVideo: true,
      after: "",
      lastAfter: "",
      fullscreen: false,
      category: "intial",
      isImageLoading: false,
      lazyLoaded: "",
      postTitle: [],
      startPage: false,
      realData: [],
      fullscreenRequested: false,
      currentFullscreenElement: {}
    };
  }

  componentDidMount() {
    console.log('asdasd',straight.includes(this.props.match.params.subreddit));
    if(straight.includes(this.props.match.params.subreddit)){
      this.setState({category: 'nsfw'})
    }
    this.props.match.params.subreddit &&
    this.props.match.params.subreddit !== "startpage"
      ? this.getSubreddit(this.props.match.params.subreddit)
      : this.setState({ startPage: true });
      
  }

  dataHandler(props) {
    let lowerCaseCategory = props.toLowerCase();
    if (lowerCaseCategory === "nsfw") {
      return straight;
    }
    if (lowerCaseCategory === "sfw") {
      return subredditArray;
    }
    if (lowerCaseCategory === "art") {
      return artArray;
    }
    if (lowerCaseCategory === "food") {
      return foodArray;
    }
    if (lowerCaseCategory === "animals") {
      return animalsArray;
    } else {
      return subredditArray.concat(artArray, foodArray, animalsArray);
    }
  }

  //checks for file type
  checkGif(url) {
    return url.match(/\.(gif)$/) !== null;
  }
  checkImg(url) {
    return url.match(/\.(jpeg|jpg|png)$/) !== null;
  }

  next = debounce(async () => {
    this.state.sliderData.length - 1 === this.state.activeSlide &&
      this.setState({ activeSlide: -1 });
    this.setState({ activeSlide: this.state.activeSlide + 1 });
    this.setState({
      isVideoLoading: this.videoPlayer && true,
      isImageLoading: !this.videoPlayer && true
    });
    this.state.isDropDownShowing && this.showDropDown();

    !this.state.activeSlide &&
      this.state.sliderData.length &&
      this.moreSubreddits("after");
  }, 100);

  previous = async () => {
    const infiniteScroll =
      (await this.state.activeSlide) <= 0
        ? this.state.sliderData.length && this.state.sliderData.length - 1
        : this.state.activeSlide - 1;
    this.setState({ activeSlide: infiniteScroll });
    this.setState({ isVideoLoading: this.videoPlayer && true });
    if (this.state.activeSlide === -1)
      this.state.activeSlide === 0 && this.moreSubreddits("before");
  };

  switchCat = async () => {
    elementIndex = 0;
    this.state.isDropDownShowing && this.showDropDown();
    this.setState({ isVideoLoading: true, isImageLoading: true });
    await this.setState({ activeSlide: 0 });
    if (goBackIndex > 0) {
      goBackIndex = goBackIndex - 1;
      if (this.state.subreddit === goBack[goBack.length - 1 - goBackIndex]) {
        !this.state.isLoading &&
          this.getSubreddit(goBack[goBack.length - goBackIndex]);
      } else
        !this.state.isLoading &&
          this.getSubreddit(goBack[goBack.length - 1 - goBackIndex]);
    } else {
      !this.state.isLoading &&
        this.getSubreddit(
          this.shuffleArray(this.dataHandler(this.state.category))
        );
      if (
        goBackIndex === 0 &&
        goBack[goBack.length - 1] !== this.state.subreddit
      ) {
        await goBack.push(this.state.subreddit);
      }
    }
  };

  goBackToLast = async () => {
    this.setState({ isVideoLoading: true });
    if (goBack.length > 1 && goBack[0] !== this.state.subreddit) {
      if (this.state.subreddit === goBack[goBack.length - 1 - goBackIndex]) {
        this.getSubreddit(goBack[goBack.length - 2 - goBackIndex]);
      } else this.getSubreddit(goBack[goBack.length - 1 - goBackIndex]);
    }
    goBackIndex < goBack.length
      ? (goBackIndex = goBackIndex + 1)
      : console.log("doing nothin...");

    if (!goBack.includes(this.state.subreddit)) {
      await goBack.push(this.state.subreddit);
    }
  };

  handleKeyDown = e => {
    const { isSearchActivated } = this.state;
    if (e.key === "ArrowLeft") {
      !isSearchActivated && this.goBackToLast();
    }
    if (e.key === "a") {
      !isSearchActivated && this.goBackToLast();
    }
    if (e.key === "ArrowDown") {
      !isSearchActivated && this.getNextElement();
    }

    if (e.key === "s") {
      !isSearchActivated && this.changeYourHeart(this.state.subreddit);
      !isSearchActivated && this.getNextElement();
    }
    if (e.key === "w") {
      !isSearchActivated && this.getPreviousElement();
    }
    if (e.key === " ") {
      if (this.videoPlayer) {
        if (this.videoPlayer.paused) {
          !isSearchActivated && this.videoPlayer.play();
        } else !isSearchActivated && this.videoPlayer.pause();
      }
    }

    if (e.key === "ArrowUp") {
      !isSearchActivated && this.getPreviousElement();
    }
    if (e.key === "ArrowRight") {
      !isSearchActivated && this.switchCat();
    }
    if (e.key === "d") {
      !isSearchActivated && this.switchCat();
    }
  };

  swipedLeft = (e, absX, isFlick) => {
    if (isFlick || absX > 30) {
      this.switchCat();
    }
  };

  swipedRight = (e, absX, isFlick) => {
    if (isFlick || absX > 30) {
      this.goBackToLast();
    }
  };
  swipedUp = (e, deltaY, isFlick) => {
    if (isFlick) {
      this.getNextElement();
    }
  };
  swipedDown = (e, deltaY, isFlick) => {
    if (isFlick) {
      this.getPreviousElement();
    }
  };

  shuffleArray = array => {
    let random = Math.floor(Math.random() * array.length);
    return array[random];
  };

  loadingOrNo = () => {
    this.state.sliderData.length === 0
      ? this.setState({ spinning: true })
      : this.setState({ spinning: false });
  };

  categorySet = val => {
    this.setState({
      category: val
    });
  };

  changeCat = async (e, cat) => {
    this.setState({ startPage: false });
    await e.preventDefault();
    await this.categorySet(cat);
    await this.getSubreddit(this.shuffleArray(this.dataHandler(cat)));
    message.info(
      `Category is ${cat}, press or swipe right to shuffle subreddit`
    );
    this.setState({ isDropDownShowing: false });
  };
  openNotification = () => {
    notification.open({
      duration: 3,
      message: "Note!",
      description:
        "Swipe, or use your keyboard arrows or a,s,w,d to shuffle or scroll posts."
    });
  };
  changeYourHeart = input => {
    input !== heart[heart.length - 1] && heart.push(input);
  };
  handleSearch = value => {
    if (!value) {
      value = "Type your search";
    }
    let result = this.dataHandler(this.state.category).filter(str =>
      str.toLowerCase().includes(value.toLowerCase())
    );
    result = result.reverse();
    result.push(value);
    result = result.reverse();
    this.setState({ dataSource: result.slice(0, 7) });
  };
  onSelect = value => {
    this.getSubreddit(value);
    this.searchBoxOpenClose();
  };
  searchBoxOpenClose = () => {
    this.setState({ isSearchActivated: !this.state.isSearchActivated });
  };

  menu = () => {
    return (
      <Menu theme="dark">
        <Menu.Item disabled>Current: {this.state.category}</Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <div onClick={e => this.changeCat(e, "NSFW")}>NSFW</div>
        </Menu.Item>
        <Menu.Item>
          <div onClick={e => this.changeCat(e, "SFW")}>SFW</div>
        </Menu.Item>
        <Menu.Item>
          <div onClick={e => this.changeCat(e, "Art")}>ART</div>
        </Menu.Item>
        <Menu.Item>
          <div onClick={e => this.changeCat(e, "Animals")}>ANIMALS</div>
        </Menu.Item>
        <Menu.Item>
          <div onClick={e => this.changeCat(e, "Food")}>FOOD</div>
        </Menu.Item>
        {/* <Menu.Item>
          <div onClick={() => this.changeYourHeart(this.state.subreddit)}>
            HEART
          </div>
        </Menu.Item> */}
        <Menu.Divider />
        <Menu.Item>
          Gifs only:
          <Switch onChange={this.toggleGifsOnly} />
        </Menu.Item>
        <Menu.Item>
          Pics only:
          <Switch onChange={this.togglePicsOnly} />
        </Menu.Item>
      </Menu>
    );
  };

  toggleGifsOnly = () => {
    this.setState({ isOnlyGifsShowing: !this.state.isOnlyGifsShowing });
    this.getSubreddit(this.state.subreddit);
  };
  togglePicsOnly = () => {
    this.setState({ isOnlyPicsShowing: !this.state.isOnlyPicsShowing });
    this.getSubreddit(this.state.subreddit);
  };

  showDropDown = () => {
    this.setState({ isDropDownShowing: !this.state.isDropDownShowing });
  };

  loadEmbed = (url, domain, embedExists) => {
    if (embedExists) {
      return (
        <div
          style={{ backgroundColor: "red" }}
          className="gridElement"
          dangerouslySetInnerHTML={{
            __html: this.htmlParser(
              embedExists.replace("allowfullscreen", "allowFullScreen")
            )
          }}
        />
      );
    }
    if (domain === "erome.com") {
      return (
        <Iframe
          url={url}
          className="gridElement"
          display="initial"
          position="relative"
          allowFullScreen
        />
      );
    }
    if (false && domain.includes("pornhub") && url.includes("pornhub")) {
      let pornhubEmbedId = url.split("=");
      console.log("pornhub");
      return (
        <Iframe
          url={`https://www.pornhub.com/embed/${pornhubEmbedId[1]}`}
          className="gridElement"
          display="initial"
          position="relative"
          allowFullScreen
        />
      );
    }

    if (domain.includes("imgur")) {
      let imgurEmbedId = url.split("/a/");
      imgurEmbedId = imgurEmbedId[1];
      let newScriptTag = document.createElement("script");
      newScriptTag.imgurEmbedId = "globalImgurEmbedScriptTag";
      newScriptTag.src = "//s.imgur.com/min/embed.js";
      newScriptTag.type = "text/javascript";

      document.querySelector("body").appendChild(newScriptTag);
      return (
        <blockquote
          className="imgur-embed-pub imgur"
          lang="en"
          data-id={`a/${imgurEmbedId}`}
        >
          <a href={`//imgur.com/${imgurEmbedId}`}>Results of day drinking</a>
        </blockquote>
      );
    }
  };

  htmlParser(string) {
    let editedString = "";
    editedString =
      string &&
      string
        .replace(/&gt;/gi, ">")
        .replace(/&lt;/gi, "<")
        .replace(/&amp;/gi, "&");
    return editedString ? editedString : "";
  }

  dataMapper = (fetchedData, removeOldContent) => {
    
    if (!removeOldContent) {
      sources = [];
      htmlAndSource = null
      
    }
    fetchedData.map((item, i) => {
      let mediaData = {};
      const { data } = item;
      const {
        preview,
        post_hint,
        media,
        media_embed,
        thumbnail_height = 1,
        thumbnail_width = 2,
        thumbnail
      } = data;
      const isGif = data.url.includes(".gif");
      mediaData.domain = data.domain || "";
      /* console.log(mediaData) */
      if (
        preview &&
        preview.reddit_video_preview &&
        preview.reddit_video_preview.scrubber_media_url
      ) {
        this.imageRatioCalculator(
          preview.reddit_video_preview.height,
          preview.reddit_video_preview.width
        );
        mediaData.video = {};
        mediaData.video.url = preview.reddit_video_preview.scrubber_media_url;
        mediaData.video.height = preview.reddit_video_preview.height;
        mediaData.video.width = preview.reddit_video_preview.width;
        mediaData.video.className = this.imageRatioCalculator(
          preview.reddit_video_preview.height,
          preview.reddit_video_preview.width
        );
        mediaData.video.poster = data.thumbnail;
      } else if (isGif) {
        mediaData.gif = {};
        mediaData.gif.url = data.url.replace(".gifv", ".gif");
        mediaData.gif.className = this.imageRatioCalculator(
          thumbnail_height,
          thumbnail_width
        );
      } else if (post_hint === "image") {
        mediaData.image = {};
        let low;
        let high;
        preview &&
          preview.images[0] &&
          preview.images[0].resolutions.map(resolution => {
            let res = resolution.height + resolution.width;
            if (res > 500 && res < 1000) {
              low = this.htmlParser(resolution.url);
            }
            if (res > 1000 && res < 2000) {
              high = this.htmlParser(resolution.url);
            }

            mediaData.image = {
              source: data.url,
              low: low,
              high: high,
              className: this.imageRatioCalculator(
                resolution.height,
                resolution.width
              )
            };
          });
      } else if (media_embed && media_embed.content) {
        mediaData.embed = {};
        mediaData.embed.iframe = this.htmlParser(
          media_embed.content || (media && media.oembed.html)
        );
        /* mediaData.domain = data.domain; */
      } else if (
        post_hint === "link" &&
        (data.domain === "pornhub.com" ||
          data.domain === "gfycat.com" ||
          data.domain === "imgur.com" ||
          data.domain === "i.imgur.com")
      ) {
        mediaData.embed = {};
        mediaData.embed.url = data.url;

        /*  mediaData.domain = data.domain; */
      }

      if (Object.entries(mediaData).length !== 0) {
        mediaData.title = data.title;
        mediaData.thumbnail = thumbnail
        sources.push(mediaData);
        /* console.log(mediaData); */
      }
    });
    this.htmlAdder();
  };
  switchCatButtons = () => {
    return (
      <React.Fragment>
        <button onClick={this.switchCat} className="iconRight">
          <Icon type="arrow-right" />
        </button>
        <button className="iconLeft" onClick={this.goBackToLast}>
          <Icon type="arrow-left" />
        </button>
      </React.Fragment>
    );
  };
  htmlAdder = () => {

    htmlAndSource = sources
      .filter(item => Object.entries(item).length !== 0)
      .map((data, i) => {
        const { gif, image, video, embed, title, domain, thumbnail } = data;
        /* let class = {...image[0].className}; */

        if (image) {
          const jsx = (
            <div
              ref={el => (this[i] = el)}
              onClick={() => {
                this.getElementIndex(jsx, i, this[i]);
              }}
              className={`gridElement ${image.className}`}
            >
              {this.switchCatButtons()}
              <img
                className={`image`}
                /* onClick={() => this.pleaseExitFullscreen()} */
                key={i}
                src={image.low || image.high || image.source}
              />
              <div className="title-text">{title}</div>
            </div>
          );
          return jsx;
        }
        if (video) {
          const jsx = (
            <div
              ref={el => (this[i] = el)}
              onClick={() => {
                this.getElementIndex(jsx, i, this[i]);
              }}
              className={`gridElement ${video.className}`}
            >
              {this.switchCatButtons()}
              <video
                key={i}
                autoPlay={true}
                allowFullScreen
                onCanPlay={() => this.setState({ isVideoLoading: false })}
                className={`video`}
                ref={el => (this[i] = el)}
                poster={image ? image.low: data.thumbnail  }
                playsInline
                /* poster={video.poster} */
                onMouseOver={() => console.log("hello")}
                onMouseLeave={() => console.log("bye")}
                loop={true}
              >
                <source src={video.url} type="video/mp4" />
                Sorry, your browser doesn't support embedded videos.
              </video>
              <div className="title-text">{title}</div>
            </div>
          );
          return jsx;
        }
        if (gif) {
          const jsx = (
            <div
              ref={el => (this[i] = el)}
              onClick={() => {
                this.getElementIndex(jsx, i, this[i]);
              }}
              className={`gridElement ${gif.className}`}
            >
              {this.switchCatButtons()}
              <img className={`gif`} key={i} src={gif.url} />
              <div className="title-text">{title}</div>
            </div>
          );
          return jsx;
        }

        if (false && embed) {
          console.log();
          if (embed.iframe)
            return (
              <React.Fragment>
                {this.loadEmbed("", "", embed.iframe)}
                <div className="title-text">{title}</div>
              </React.Fragment>
            );
          else if (embed.url)
            return (
              <React.Fragment>
                {this.loadEmbed(embed.url, domain, false)}
                <div className="title-text">{title}</div>
              </React.Fragment>
            );
        }
      });
    htmlAndSource = htmlAndSource.filter(item => item);
  };



  imageRatioCalculator = (height, width) => {
    let ratio = height / width;
    if (ratio < 0.5) return "superWide";

    if (ratio >= 0.5 && ratio < 0.8) return "veryWide";

    /*  if (ratio >= 0.7 && ratio < 0.9) return "wide"; */

    if (ratio >= 0.8 && ratio < 1.2) return "rectangular";

    /* if (ratio >= 1.1 && ratio < 1.3) return "tall"; */

    if (ratio >= 1.2 && ratio < 1.5) return "veryTall";

    if (ratio >= 1.5) return "superTall";
  };
  getElementIndex = (element, index) => {
    elementIndex = index;
    this.setState({
      element: element,
      fullscreenActive: !this.state.fullscreenActive
    });
  };
  getPreviousElement = async () => {
    if (!elementIndex) return;
    elementIndex = elementIndex - 1;
    if (this.state.element === htmlAndSource[elementIndex - 1])
      this.setState({ elementIndex: elementIndex - 1 });
    this.setState({
      element: htmlAndSource[elementIndex]
    });
  };
  getNextElement = () => {
    if (elementIndex + 2 > htmlAndSource.length) {
      this.moreSubreddits();
      return;
    } else {
      elementIndex = elementIndex + 1;
      if (this.state.element === htmlAndSource[elementIndex]) {
        elementIndex = elementIndex + 1;
      }
      this.setState({
        element: htmlAndSource[elementIndex]
      });
    }
  };
  render() {
    
    console.log(this.state.fullscreenActive)
    return (
      <Swipeable
        className="wrapper"
        onKeyDown={this.handleKeyDown}
        /* onSwipedDown={this.swipedDown}
        onSwipedUp={this.swipedUp} */
        onSwipedLeft={this.swipedLeft}
        onSwipedRight={this.swipedRight}
      >
        {this.state.fullscreenActive && (
          <Swipeable
            className="fullscreenScroll"
            onSwipedDown={this.swipedDown}
            onSwipedUp={this.swipedUp}
            onSwipedLeft={this.swipedLeft}
            onSwipedRight={this.swipedRight}
          >
            {this.state.element ? (
              this.state.element
            ) : (
              <Spin className="spinner" />
            )}

            <button
              className="fullscreenButtonPrevious"
              onClick={() => this.getPreviousElement()}
            />
            <button
              className="fullscreenButtonNext"
              onClick={() => this.getNextElement()}
            />
          </Swipeable>
        )}
        {this.state.category === "intial" && this.state.startPage ? (
          <div className="categoryModal">
            <div className="description">
              Welcome to sliddit.com!
              <br />
              Choose a category:
            </div>
            <div className="grid-container">
              <Button
                className="item1"
                onClick={e => this.changeCat(e, "NSFW")}
              >
                NSFW
              </Button>

              <Button className="item2" onClick={e => this.changeCat(e, "Art")}>
                ART
              </Button>

              <Button
                className="item3"
                onClick={e => this.changeCat(e, "Food")}
              >
                FOOD
              </Button>

              <Button className="item4" onClick={e => this.changeCat(e, "SFW")}>
                SFW
              </Button>

              <Button
                className="item5"
                onClick={e => this.changeCat(e, "Animals")}
              >
                ANIMALS
              </Button>
            </div>
          </div>
        ) : null}
        {/* <Icon onClick={this.previous} className="iconUp" type="up" /> */}

        <div className={this.state.fullscreen ? "topbarZen" : "topbarZen"}>
          <div className="searchWrapper">
            <Transition
              in={this.state.isSearchActivated}
              unmountOnExit
              mountOnEnter
              timeout={500}
            >
              {status => (
                <AutoComplete
                  placeholder="Search here"
                  autoFocus
                  className={`autocomplete--${status}`}
                  dataSource={this.state.dataSource}
                  onBlur={() =>
                    this.setState({
                      isSearchActivated: false
                    })
                  }
                  onSelect={this.onSelect}
                  onSearch={this.handleSearch}
                />
              )}
            </Transition>

            <Transition
              in={!this.state.isSearchActivated}
              unmountOnExit
              mountOnEnter
              timeout={500}
            >
              {status => (
                <Button
                  ghost
                  className={`searchButton--${status}`}
                  onClick={() => this.searchBoxOpenClose()}
                >
                  <Icon type="search" />
                </Button>
              )}
            </Transition>
          </div>
          <div className="middleWrapper">
            <h1 className="scrollLogo">sliddit.</h1>
          </div>

          <Dropdown
            visible={this.state.isDropDownShowing}
            overlay={this.menu()}
            onClick={this.showDropDown}
          >
            <div className="iconSetting">
              <Icon
                type={this.state.isDropDownShowing ? "close" : "setting"}
                className="chooseCat"
              />
            </div>
          </Dropdown>
        </div>
        <div className={this.state.fullscreenActive ? "contentZen" : "contentZen"}>
          {this.switchCatButtons()}
          {this.state.isLoading ? (
            <div className="spinner">
              <Spin />
              <div className="centered-text">
                Loading <strong>{this.state.subreddit}</strong> category
              </div>
            </div>
          ) : (
            <div className="gridMedia">
              {htmlAndSource.map((element, i) => (
                <LazyLoad unmountIfInvisible={true} height={500} offset={100} key={i}>
                  {element}
                </LazyLoad>
              ))}
            </div>
          )}

          <div className="loadMoreWrapper">
            {this.state.isLoadingMore ? (
              <Spin style={{ margin: "auto", display: "block" }} />
            ) : (
              !this.state.isLoading && (
                <Button
                  onClick={() => {
                    this.moreSubreddits();
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
          <div className="downDiv">
            <h2 className="subredditName">
              <Icon type="tag-o" />
              {this.state.subreddit}
            </h2>
          </div>
          {/* <Icon
            className="fullscreen-icon"
            onClick={() =>
              this.setState({ fullscreen: !this.state.fullscreen })
            }
            type={this.state.fullscreen ? "shrink" : "arrows-alt"}
          /> */}
        </div>
      </Swipeable>
    );
  }

  getSubreddit = async subreddit => {
    await this.setState({
      subreddit: subreddit,
      isLoading: true
    });
    this.state.category === "intial" && !this.props.match.params.subreddit
      ? null
      : this.props.history.push(`/${this.state.subreddit}`);

    await fetch(
      `https://www.reddit.com/r/${this.state.subreddit}.json?limit=15`
    )
      .then(response => response.json())
      .then(jsonData => {
        this.setState({
          after: jsonData.data.after,
          lastAfter: jsonData.data.after
        });
        this.dataMapper(jsonData.data.children);
        /* this.dataToHtml(jsonData.data.children); */
      })

      .catch(() => {
        this.getSubreddit(
          this.shuffleArray(this.dataHandler(this.state.category))
        );
      });
    this.setState({ isLoading: false });
  };

  moreSubreddits = async () => {
    this.setState({ isLoadingMore: true });
    await fetch(
      `https://www.reddit.com/r/${this.state.subreddit}.json?after=${
        this.state.after
      }&limit=15`
    )
      .then(response => response.json())
      .then(jsonData => {
        this.setState({
          after: jsonData.data.after
        });
        this.dataMapper(jsonData.data.children, true);
      })
      .catch(error => {
        console.log("error", error);
        alert(error);
      });
    this.setState({ isLoadingMore: false });
  };
}

export default Scroller;
