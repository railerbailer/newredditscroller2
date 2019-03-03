import React, { Component } from "react";
import Swipeable from "react-swipeable";
import "antd/dist/antd.css";
import { debounce } from "lodash";
import { Transition } from "react-transition-group";

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
  NSFW,
  artArray,
  foodArray,
  animalsArray
} from "../subreddits";
import "../App.css";
import "react-html5video/dist/styles.css";

let goBack = [];
let goBackIndex = 0;
let heart = [];
class Scroller extends Component {
  constructor(props) {
    super(props);
    React.CreateRef = this.renderFocus = React.createRef();

    this.state = {
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
      visibleUp: true,
      visibility: true,
      visibleBackLeft: false,
      alreadyChecked: false,
      spinning: true,
      underage: true,
      isLoadingVideo: true,
      after: "",
      before: "",
      fullscreen: false
    };
  }

  componentDidMount() {
    this.getSubreddit(this.shuffleArray(this.dataHandler("SFW")));
  }

  dataHandler(props) {
    if (props === "NSFW") {
      return NSFW;
    }
    if (props === "SFW") {
      return subredditArray;
    }
    if (props === "Art") {
      return artArray;
    }
    if (props === "Food") {
      return foodArray;
    }
    if (props === "Animals") {
      return animalsArray;
    } else {
      return subredditArray;
    }
  }

  //checks for file type
  checkGif(url) {
    return url.match(/\.(gif)$/) !== null;
  }
  checkImg(url) {
    return url.match(/\.(jpeg|jpg|png)$/) !== null;
  }

  imageParser(url) {
    let editedUrl = "";
    editedUrl = url
      .replace(/&gt;/gi, ">")
      .replace(/&lt;/gi, "<")
      .replace(/&amp;/gi, "&");
    return editedUrl;
  }

  next = debounce(async () => {
    this.state.sliderData.length - 1 === this.state.activeSlide &&
      this.setState({ activeSlide: -1 });
    this.setState({ activeSlide: this.state.activeSlide + 1 });
    this.setState({ isVideoLoading: this.videoPlayer && true });
    this.state.isDropDownShowing && this.showDropDown();

    !this.state.activeSlide &&
      this.state.sliderData.length &&
      this.moreSubreddits();
  }, 100);
  previous = async () => {
    if (this.state.activeSlide) {
      const infiniteScroll =
        (await this.state.activeSlide) <= 0
          ? this.state.sliderData.length && this.state.sliderData.length - 1
          : this.state.activeSlide - 1;
      this.setState({ activeSlide: infiniteScroll });
      this.setState({ isVideoLoading: this.videoPlayer && true });
    }
    // this.state.activeSlide===0 && this.goBackSubreddits();
  };

  switchCat = async () => {
    this.state.isDropDownShowing && this.showDropDown();
    this.setState({ isVideoLoading: true });
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
          this.shuffleArray(this.dataHandler(this.props.category))
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
      !isSearchActivated && this.next();
    }

    if (e.key === "s") {
      !isSearchActivated && this.changeYourHeart(this.state.subreddit);
      !isSearchActivated && this.next();
    }
    if (e.key === "w") {
      !isSearchActivated && this.previous();
    }
    if (e.key === " ") {
      if (this.videoPlayer) {
        if (this.videoPlayer.paused) {
          !isSearchActivated && this.videoPlayer.play();
        } else !isSearchActivated && this.videoPlayer.pause();
      }
    }

    if (e.key === "ArrowUp") {
      !isSearchActivated && this.previous();
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
      this.next();
    }
  };
  swipedDown = (e, deltaY, isFlick) => {
    if (isFlick) {
      this.previous();
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

  changeCat = async (e, cat) => {
    await e.preventDefault();
    await this.props.categorySet(cat);
    await this.getSubreddit(this.shuffleArray(this.dataHandler(cat)));
    message.info(
      `Category is ${cat}, press or swipe right to shuffle subreddit`
    );
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
    console.log("=========", heart);
  };
  handleSearch = value => {
    if (!value) {
      value = "Type your search";
    }
    let result = this.dataHandler(this.props.category).filter(str =>
      str.toLowerCase().includes(value.toLowerCase())
    );
    result = result.reverse();
    result.push(value);
    result = result.reverse();
    this.setState({ dataSource: result.slice(0, 7) });
    console.log(this.state.dataSource);
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
        <Menu.Item disabled>Current: {this.props.category}</Menu.Item>
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

  render() {
    return (
      <Swipeable
        className="wrapper"
        onKeyDown={this.handleKeyDown}
        onSwipedDown={this.swipedDown}
        onSwipedUp={this.swipedUp}
        onSwipedLeft={this.swipedLeft}
        onSwipedRight={this.swipedRight}
      >
        {this.props.category === "Switch category" ? (
          <div className="categoryModal">
            <div className="description">
              Welcome to Sliddit.com!
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

        <div className={this.state.fullscreen ? "topbarZen" : "topBar"}>
          <div className="searchWrapper">
            <Transition
              in={this.state.isSearchActivated}
              unmountOnExit
              mountOnEnter
              timeout={5500}
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
              timeout={0}
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
            <Button ghost className="iconSetting">
              <Icon
                type={this.state.isDropDownShowing ? "close" : "setting"}
                className="chooseCat"
              />
            </Button>
          </Dropdown>
        </div>
        <div className={this.state.fullscreen ? "contentZen" : "content"}>
          {!this.state.isSearchActivated && (
            <button
              className="inputFocus"
              ref={button =>
                button && !this.state.isSearchActivated && button.focus()
              }
            />
          )}
          <button onClick={this.switchCat} className="iconRight">
            <Icon type="arrow-right" />
          </button>
          <button className="iconLeft" onClick={this.goBackToLast}>
            <Icon type="arrow-left" />
          </button>

          {this.state.isLoading ? (
            <button autoFocus className="subRedditTitle">
              <Spin wrapperClassName="subRedditTitle" size="large" />
              <p className="loading">
                Loading <Icon type="tag-o" />
                {this.state.subreddit}
              </p>
            </button>
          ) : (
            <React.Fragment>
              {this.videoPlayer && this.state.isVideoLoading && (
                <Icon
                  style={{
                    zIndex: 44,
                    color: "white",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    fontSize: "50px"
                  }}
                  type="loading"
                />
              )}

              {this.state.sliderData[this.state.activeSlide]}
            </React.Fragment>
          )}

          <div className="downDiv">
            <button onClick={this.next} className="iconDownClicker">
              <h2 className="subredditName">
                <Icon type="tag-o" />
                {this.state.subreddit}
              </h2>
              <Icon className="iconDown" type="arrow-down" />
            </button>
          </div>

          <Icon
            className="fullscreen-icon"
            onClick={() =>
              this.setState({ fullscreen: !this.state.fullscreen })
            }
            type={this.state.fullscreen ? "close" : "setting"}
          />
        </div>
      </Swipeable>
    );
  }

  getSubreddit = async subreddit => {
    let heartPlaceholder = heart;
    let subredditOrHeart =
      (await this.state.isHeartModeOn) && heart.length > 1
        ? heartPlaceholder.join("+")
        : subreddit;
    await this.setState({
      subreddit: subredditOrHeart,
      sliderData: [],
      isLoading: true
    });

    //Om det blev fel kan det vara annat än url som inte finns...
    await fetch(
      `https://www.reddit.com/r/${this.state.subreddit}.json?limit=100`
    )
      .then(response => response.json())
      .then(jsonData => {
        this.setState({
          after: jsonData.data.after,
          before: jsonData.data.after
        });
        let childs = jsonData.data.children;
        this.dataToHtml(childs);
        console.log(this.state.activeSlide);
      })
      .catch(() => {
        this.getSubreddit(
          this.shuffleArray(this.dataHandler(this.props.category))
        );
      });
    this.setState({ isLoading: false });
  };

  goBackSubreddits = async () => {
    await fetch(
      `https://www.reddit.com/r/${this.state.subreddit}.json?before=${
        this.state.before
      }&limit=100`
    )
      .then(response => response.json())
      .then(jsonData => {
        let childs = jsonData.data.children;
        this.dataToHtml(childs);
        this.setState({
          after: jsonData.data.after,
          activeSlide: this.state.sliderData.length - 1,
          before: jsonData.data.before
        });
      })
      .catch(() => {
        this.getSubreddit(
          this.shuffleArray(this.dataHandler(this.props.category))
        );
      });
    this.setState({ isLoading: false });
  };

  moreSubreddits = async () => {
    await fetch(
      `https://www.reddit.com/r/${this.state.subreddit}.json?after=${
        this.state.after
      }&limit=100`
    )
      .then(response => response.json())
      .then(jsonData => {
        let childs = jsonData.data.children;
        this.dataToHtml(childs);
        this.setState({
          after: jsonData.data.after,
          activeSlide: 0,
          before: jsonData.data.after
        });
      })
      .catch(() => {
        this.getSubreddit(
          this.shuffleArray(this.dataHandler(this.props.category))
        );
      });
    this.setState({ isLoading: false });
  };

  dataToHtml = data => {
    let zeroNullData = false;
    let datavar = data.map((children, i) => {
      if (
        !this.state.isOnlyPicsShowing ||
        (this.state.isOnlyPicsShowing && this.state.isOnlyGifsShowing)
      ) {
        if (
          children.data.post_hint === "link" &&
          children.data.preview.reddit_video_preview
        ) {
          zeroNullData = true;
          return (
            <div className="videoDiv" key={i}>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                
              >
                {status => (
                  <video
                    onCanPlay={() => this.setState({ isVideoLoading: false })}
                    className={`video transition--${status}`}
                    ref={el => (this.videoPlayer = el)}
                    muted
                    playsInline
                    autoPlay={this.state.autoPlay}
                    poster={children.data.thumbnail || ""}
                    preload="none"
                    loop={this.state.loop}
                  >
                    <source
                      type="video/mp4"
                      src={
                        children.data.preview.reddit_video_preview
                          .scrubber_media_url
                      }
                    />

                    <p>
                      Your browser doesn't support HTML5 video. Here is a{" "}
                      <a
                        href={
                          children.data.preview.reddit_video_preview
                            .scrubber_media_url
                        }
                      >
                        link to the video
                      </a>{" "}
                      instead.
                    </p>
                  </video>
                )}
              </Transition>
            </div>
          );
        }

        if (
          children.data.post_hint === "rich:video" &&
          children.data.preview.reddit_video_preview
        ) {
          zeroNullData = true;
          return (
            <div className="videoDiv" key={i}>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                
              >
                {status => (
                  <video
                    onCanPlay={() => this.setState({ isVideoLoading: false })}
                    className={`video transition--${status}`}
                    ref={el => (this.videoPlayer = el)}
                    muted
                    preload="none"
                    playsInline
                    autoPlay={this.state.autoPlay}
                    poster={children.data.thumbnail || ""}
                    loop={this.state.loop}
                  >
                    <source
                      type="video/mp4"
                      src={
                        children.data.preview.reddit_video_preview
                          .scrubber_media_url
                      }
                    />
                    <p>
                      Your browser doesn't support HTML5 video. Here is a{" "}
                      <a
                        href={
                          children.data.preview.reddit_video_preview
                            .scrubber_media_url
                        }
                      >
                        link to the video
                      </a>{" "}
                      instead.
                    </p>
                  </video>
                )}
              </Transition>
            </div>
          );
        }
        if (
          children.data.post_hint === "hosted:video" &&
          children.data.media.reddit_video
        ) {
          zeroNullData = true;
          return (
            <div className="videoDiv" key={i}>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                
              >
                {status => (
                  <video
                    onCanPlay={() => this.setState({ isVideoLoading: false })}
                    className={`video transition--${status}`}
                    ref={el => (this.videoPlayer = el)}
                    muted
                    playsInline
                    autoPlay={this.state.autoPlay}
                    loop={this.state.loop}
                    preload="none"
                    poster={children.data.thumbnail || ""}
                  >
                    <source
                      type="video/mp4"
                      src={children.data.media.reddit_video.scrubber_media_url}
                    />
                    <p>
                      Your browser doesn't support HTML5 video. Here is a{" "}
                      <a
                        href={
                          children.data.media.reddit_video.scrubber_media_url
                        }
                      >
                        link to the video
                      </a>{" "}
                      instead.
                    </p>
                  </video>
                )}
              </Transition>
            </div>
          );
        }

        if (
          children.data.post_hint === "image" &&
          children.data.preview.reddit_video_preview
        ) {
          zeroNullData = true;
          return (
            <div className="videoDiv" key={i}>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                
              >
                {status => (
                  <video
                    onCanPlay={() => this.setState({ isVideoLoading: false })}
                    className={`video transition--${status}`}
                    ref={el => (this.videoPlayer = el)}
                    muted
                    playsInline
                    autoPlay={this.state.autoPlay}
                    poster={children.data.thumbnail || ""}
                    loop={this.state.loop}
                    preload="none"
                  >
                    <source
                      type="video/mp4"
                      src={
                        children.data.preview.reddit_video_preview
                          .scrubber_media_url
                      }
                    />
                    <p className="titleText">
                      Your browser doesn't support HTML5 video. Here is a{" "}
                      <a
                        href={
                          children.data.preview.reddit_video_preview
                            .scrubber_media_url
                        }
                      >
                        link to the video
                      </a>{" "}
                      instead.
                    </p>
                  </video>
                )}
              </Transition>
            </div>
          );
        }
      }
      if (
        (children.data.post_hint === "image" &&
          !this.state.isOnlyGifsShowing) ||
        (children.data.post_hint === "image" &&
          this.state.isOnlyPicsShowing &&
          this.state.isOnlyGifsShowing)
      ) {
        let sizeRatio =
          children.data.preview.images[0].source.height +
          children.data.preview.images[0].source.width;
        if (children.data.preview.images[0].source.height < 300) {
          zeroNullData = true;
          return (
            <div className="imgDiv" key={i}>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                
              >
                {status => (
                  <img
                    className={`image transition--${status}`}
                    src={this.imageParser(
                      children.data.preview.images[0].source.url
                    )}
                    alt="{logo}"
                  />
                )}
              </Transition>
            </div>
          );
        }

        if (
          children.data.preview.images[0].resolutions[3] &&
          sizeRatio > 1500
        ) {
          zeroNullData = true;
          return (
            <div className="imgDiv" key={i}>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                
              >
                {status => (
                  <img
                    className={`image transition--${status}`}
                    src={this.imageParser(
                      children.data.preview.images[0].resolutions[3].url
                    )}
                    alt="{logo}"
                  />
                )}
              </Transition>
            </div>
          );
        }

        if (
          children.data.preview.images[0].resolutions[4] &&
          sizeRatio < 1500
        ) {
          zeroNullData = true;
          return (
            <div className="imgDiv" key={i}>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                
              >
                {status => (
                  <img
                    className={`image transition--${status}`}
                    src={this.imageParser(
                      children.data.preview.images[0].resolutions[4].url
                    )}
                    alt="{logo}"
                  />
                )}
              </Transition>
            </div>
          );
        }
      } else {
        return null;
      }
      return null;
    });
    if (zeroNullData === true) {
      this.setState({ sliderData: datavar.filter(e => e !== null) });
    } else {
      // this.state.subredditOrHeart &&
      this.getSubreddit(
        this.shuffleArray(this.dataHandler(this.props.category))
      );
    }
  };

  HighDataToHtml = data => {
    let zeroNullData = false;
    let datavar = data.map((children, i) => {
      if (
        children.data.post_hint === "link" &&
        children.data.preview.reddit_video_preview
      ) {
        zeroNullData = true;
        return (
          <div className="videoDiv" key={i}>
            <p className="titleText">{children.data.title}</p>
            <Transition
              in={true}
              appear={true}
              unmountOnExit
              mountOnEnter
              
            >
              {status => (
                <video
                  onCanPlay={() => this.setState({ isVideoLoading: false })}
                  className={`video transition--${status}`}
                  ref={el => (this.videoPlayer = el)}
                  muted
                  playsInline
                  autoPlay={this.state.autoPlay}
                  poster={this.imageParser(
                    children.data.preview.images[0].resolutions[1].url &&
                      children.data.preview.images[0].resolutions[1].url
                  )}
                  preload="none"
                  loop={this.state.loop}
                >
                  <source
                    type="video/mp4"
                    src={this.imageParser(
                      children.data.preview.images[0].variants.mp4.source.url
                    )}
                  />
                  <source
                    type="video/mp4"
                    src={
                      children.data.preview.reddit_video_preview
                        .scrubber_media_url
                    }
                  />

                  <p>
                    Your browser doesn't support HTML5 video. Here is a{" "}
                    <a
                      href={
                        children.data.preview.reddit_video_preview
                          .scrubber_media_url
                      }
                    >
                      link to the video
                    </a>{" "}
                    instead.
                  </p>
                </video>
              )}
            </Transition>
          </div>
        );
      }

      if (
        children.data.post_hint === "rich:video" &&
        children.data.preview.reddit_video_preview
      ) {
        zeroNullData = true;
        return (
          <div className="videoDiv" key={i}>
            <p className="titleText">{children.data.title}</p>
            <Transition
              in={true}
              appear={true}
              unmountOnExit
              mountOnEnter
              
            >
              {status => (
                <video
                  onCanPlay={() => this.setState({ isVideoLoading: false })}
                  className={`video transition--${status}`}
                  ref={el => (this.videoPlayer = el)}
                  muted
                  preload="none"
                  playsInline
                  autoPlay={this.state.autoPlay}
                  poster={
                    children.data.preview.images[0].resolutions[1].url &&
                    children.data.preview.images[0].resolutions[1].url
                  }
                  loop={this.state.loop}
                >
                  <source
                    type="video/mp4"
                    src={this.imageParser(
                      children.data.preview.images[0].variants.mp4.source.url
                    )}
                  />
                  <source
                    type="video/mp4"
                    src={
                      children.data.preview.reddit_video_preview
                        .scrubber_media_url
                    }
                  />
                  <p>
                    Your browser doesn't support HTML5 video. Here is a{" "}
                    <a
                      href={
                        children.data.preview.reddit_video_preview
                          .scrubber_media_url
                      }
                    >
                      link to the video
                    </a>{" "}
                    instead.
                  </p>
                </video>
              )}
            </Transition>
          </div>
        );
      }
      if (
        children.data.post_hint === "hosted:video" &&
        children.data.media.reddit_video
      ) {
        zeroNullData = true;
        return (
          <div className="videoDiv" key={i}>
            <p className="titleText">{children.data.title}</p>
            <Transition
              in={true}
              appear={true}
              unmountOnExit
              mountOnEnter
              
            >
              {status => (
                <video
                  onCanPlay={() => this.setState({ isVideoLoading: false })}
                  className={`video transition--${status}`}
                  ref={el => (this.videoPlayer = el)}
                  muted
                  playsInline
                  autoPlay={this.state.autoPlay}
                  loop={this.state.loop}
                  preload="none"
                >
                  <source
                    type="video/mp4"
                    src={this.imageParser(
                      children.data.preview.images[0].variants.mp4.source.url
                    )}
                  />
                  <source
                    type="video/mp4"
                    src={children.data.media.reddit_video.scrubber_media_url}
                  />
                  <p>
                    Your browser doesn't support HTML5 video. Here is a{" "}
                    <a
                      href={children.data.media.reddit_video.scrubber_media_url}
                    >
                      link to the video
                    </a>{" "}
                    instead.
                  </p>
                </video>
              )}
            </Transition>
          </div>
        );
      }

      if (
        children.data.post_hint === "image" &&
        children.data.preview.reddit_video_preview
      ) {
        zeroNullData = true;
        return (
          <div className="videoDiv" key={i}>
            <p className="titleText">{children.data.title}</p>
            <Transition
              in={true}
              appear={true}
              unmountOnExit
              mountOnEnter
              
            >
              {status => (
                <video
                  onCanPlay={() => this.setState({ isVideoLoading: false })}
                  className={`video transition--${status}`}
                  ref={el => (this.videoPlayer = el)}
                  muted
                  playsInline
                  autoPlay={this.state.autoPlay}
                  poster={this.imageParser(
                    children.data.preview.images[0].resolutions[1].url &&
                      children.data.preview.images[0].resolutions[1].url
                  )}
                  loop={this.state.loop}
                  preload="none"
                >
                  <source
                    type="video/mp4"
                    src={this.imageParser(
                      children.data.preview.images[0].variants.mp4.source.url
                    )}
                  />
                  <source
                    type="video/mp4"
                    src={
                      children.data.preview.reddit_video_preview
                        .scrubber_media_url
                    }
                  />
                  <p className="titleText">
                    Your browser doesn't support HTML5 video. Here is a{" "}
                    <a
                      href={
                        children.data.preview.reddit_video_preview
                          .scrubber_media_url
                      }
                    >
                      link to the video
                    </a>{" "}
                    instead.
                  </p>
                </video>
              )}
            </Transition>
          </div>
        );
      }

      if (
        children.data.post_hint === "image" &&
        !this.state.isOnlyGifsShowing
      ) {
        let sizeRatio =
          children.data.preview.images[0].source.height +
          children.data.preview.images[0].source.width;
        if (children.data.preview.images[0].source.height < 300) {
          zeroNullData = true;
          return (
            <div className="imgDiv" key={i}>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                
              >
                {status => (
                  <img
                    className={`image transition--${status}`}
                    src={this.imageParser(
                      children.data.preview.images[0].source.url
                    )}
                    alt="{logo}"
                  />
                )}
              </Transition>
            </div>
          );
        }

        if (
          children.data.preview.images[0].resolutions[3] &&
          sizeRatio > 1500
        ) {
          zeroNullData = true;
          return (
            <div className="imgDiv" key={i}>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                
              >
                {status => (
                  <img
                    className={`image transition--${status}`}
                    src={this.imageParser(
                      children.data.preview.images[0].resolutions[3].url
                    )}
                    alt="{logo}"
                  />
                )}
              </Transition>
            </div>
          );
        }

        if (
          children.data.preview.images[0].resolutions[4] &&
          sizeRatio < 1500
        ) {
          zeroNullData = true;
          return (
            <div className="imgDiv" key={i}>
              <p className="titleText">{children.data.title}</p>
              <Transition
                in={true}
                appear={true}
                unmountOnExit
                mountOnEnter
                
              >
                {status => (
                  <img
                    className={`image transition--${status}`}
                    src={this.imageParser(
                      children.data.preview.images[0].resolutions[4].url
                    )}
                    alt="{logo}"
                  />
                )}
              </Transition>
            </div>
          );
        }
      } else {
        return null;
      }
      return null;
    });
    if (zeroNullData === true) {
      this.setState({ sliderData: datavar.filter(e => e !== null) });
    } else {
      // this.state.subredditOrHeart &&
      this.getSubreddit(
        this.shuffleArray(this.dataHandler(this.props.category))
      );
    }
  };
}

export default Scroller;
