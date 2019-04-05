import React, { Component, lazy } from "react";
import Swipeable from "react-swipeable";
import "antd/dist/antd.css";
import "../App.css";
import { throttle } from "lodash";
import { Transition } from "react-transition-group";
import AddMarkup from "./addMarkup.js";
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
/* const AddMarkup = lazy(() => import("./addMarkup.js")); */
let sources = [];
let goBack = [];
let goBackIndex = 0;
class Scroller extends Component {
  state = {
    mobile: false,
    load: "not ok",
    isLoadingMore: false,
    fullscreenActive: false,
    scrollHeight: 0,
    subredditData: [],
    isDropDownShowing: false,
    isLoading: false,
    isOnlyGifsShowing: false,
    isOnlyPicsShowing: false,
    isSearchActivated: false,
    dataSource: [],
    subreddit: "",
    visibility: true,
    visibleBackLeft: false,
    after: "",
    lastAfter: "",
    category: "No category chosen",
    isImageLoading: false,
    message: "not at bottom",
    element: "",
    preloadElement: "",
    isFirstVisit: true,
    htmlAndSource: []
  };

  /*  componentWillUpdate() {
    if (this.state.message === "bottom reached") {
      this.setState({ message: "hello" }, () => this.moreSubreddits());
    }
  } */
  componentWillMount() {
    if (window.screen.availWidth < 800) this.setState({ mobile: true });
  }
  componentDidMount() {
    if (straight.includes(this.props.match.params.subreddit)) {
      this.setState({ category: "nsfw" });
    }
    this.props.match.params.subreddit
      ? this.getSubreddit(this.props.match.params.subreddit)
      : this.getSubreddit(
          this.shuffleArray(this.dataHandler(this.state.category))
        );
  }

  /*   componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }
 */

  toggleFullscreen = () => {
    !this.state.isSearchActivated &&
      this.setState({ fullscreenActive: !this.state.fullscreenActive });
  };

  dataHandler(props) {
    let lowerCaseCategory = props.toLowerCase();
    if (lowerCaseCategory === "nsfw") {
      return straight;
    } else if (lowerCaseCategory === "sfwall") {
      return subredditArray.concat(artArray, foodArray, animalsArray);
    } else if (lowerCaseCategory === "sfw") {
      return subredditArray;
    } else if (lowerCaseCategory === "art") {
      return artArray;
    } else if (lowerCaseCategory === "food") {
      return foodArray;
    } else if (lowerCaseCategory === "animals") {
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

  switchCat = throttle(async () => {
    this.state.isDropDownShowing && this.showDropDown();

    if (goBackIndex > 0) {
      goBackIndex = goBackIndex - 1;
      if (this.state.subreddit === goBack[goBack.length - 1 - goBackIndex]) {
        !this.state.isLoading &&
          (await this.getSubreddit(goBack[goBack.length - goBackIndex]));
      } else
        !this.state.isLoading &&
          (await this.getSubreddit(goBack[goBack.length - 1 - goBackIndex]));
    } else {
      !this.state.isLoading &&
        (await this.getSubreddit(
          this.shuffleArray(this.dataHandler(this.state.category))
        ));
      if (
        goBackIndex === 0 &&
        goBack[goBack.length - 1] !== this.state.subreddit
      ) {
        goBack.push(this.state.subreddit);
      }
    }
  }, 500);

  goBackToLast = () => {
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
      goBack.push(this.state.subreddit);
    }
  };

  handleKeyDown = e => {
    const { isSearchActivated } = this.state;
    if (e.key === "ArrowLeft") {
      !isSearchActivated && this.goBackToLast();
    }
    if (e.key === "Escape") {
      !isSearchActivated && this.setState({ fullscreenActive: false });
    }
    if (e.key === "a") {
      !isSearchActivated && this.goBackToLast();
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

  shuffleArray = array => {
    let random = Math.floor(Math.random() * array.length);
    return array[random];
  };

  categorySet = val => {
    this.setState({
      category: val
    });
  };

  changeCat = (e, cat) => {
    this.categorySet(cat);
    this.getSubreddit(this.shuffleArray(this.dataHandler(cat)));
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
        <Menu.Item disabled>Domains ({this.state.category})</Menu.Item>
        <Menu.Divider />
        <Menu.Item>
          <div onClick={e => this.changeCat(e, "NSFW")}>NSFW</div>
        </Menu.Item>
        <Menu.Item>
          <div onClick={e => this.changeCat(e, "SFWALL")}>SFW</div>
        </Menu.Item>
        {/* <Menu.Item>
          <div onClick={e => this.changeCat(e, "ART")}>ART</div>
        </Menu.Item>
        <Menu.Item>
          <div onClick={e => this.changeCat(e, "ANIMALS")}>ANIMALS</div>
        </Menu.Item>
        <Menu.Item>
          <div onClick={e => this.changeCat(e, "FOOD")}>FOOD</div>
        </Menu.Item> */}
        <Menu.Divider />
        <Menu.Item>
          Gifs only:{"  "}
          <Switch onChange={this.toggleGifsOnly} />
        </Menu.Item>
        <Menu.Item>
          Pics only:{"  "}
          <Switch onChange={this.togglePicsOnly} />
        </Menu.Item>
      </Menu>
    );
  };

  toggleIsLoading = state => this.setState({ isLoading: state });

  toggleGifsOnly = async () => {
    this.setState({
      isOnlyGifsShowing: !this.state.isOnlyGifsShowing,
      isDropDownShowing: false
    });
    await this.getSubreddit(this.state.subreddit);
  };
  togglePicsOnly = () => {
    this.setState({
      isOnlyPicsShowing: !this.state.isOnlyPicsShowing,
      isDropDownShowing: false
    });
    this.getSubreddit(this.state.subreddit);
  };

  showDropDown = () => {
    this.setState({ isDropDownShowing: !this.state.isDropDownShowing });
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

  dataMapper = async (fetchedData, notLoadMore) => {
    if (!notLoadMore) {
      sources = [];
    }
    let weGotGifs = false;
    fetchedData.map((item, i) => {
      let mediaData = {};
      const { data } = item;
      const {
        preview,
        post_hint,
        /*  media,
        media_embed, */
        thumbnail_height = 1,
        thumbnail_width = 2,
        thumbnail
      } = data;
      const isGif = data.url.includes(".gif");

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
        weGotGifs = true;
        let low = "";
        preview &&
          preview.images[0].resolutions.map(resolution => {
            let res = resolution.height + resolution.width;
            if (res > 500 && res < 1000) {
              low = this.htmlParser(resolution.url);
            }
          });
        mediaData.video.image = low;
        mediaData.video.poster = data.thumbnail;
        mediaData.domain = data.domain || "";
        mediaData.title = data.title;
        mediaData.thumbnail = thumbnail;
      } else if (isGif) {
        mediaData.gif = {};
        mediaData.gif.url = data.url.replace(".gifv", ".gif");
        mediaData.gif.className = this.imageRatioCalculator(
          thumbnail_height,
          thumbnail_width
        );
        mediaData.domain = data.domain || "";
        mediaData.title = data.title;
        mediaData.thumbnail = thumbnail;
        weGotGifs = true;
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
        mediaData.domain = data.domain || "";
        mediaData.title = data.title;
        mediaData.thumbnail = thumbnail;
      }

      /*    else if (media_embed && media_embed.content) {
        mediaData.embed = {};
        mediaData.embed.iframe = this.htmlParser(
          media_embed.content || (media && media.oembed.html)
        );
         mediaData.domain = data.domain || "";
      } else if (
        post_hint === "link" &&
        (data.domain === "pornhub.com" ||
          data.domain === "gfycat.com" ||
          data.domain === "imgur.com" ||
          data.domain === "i.imgur.com")
      ) {
        mediaData.embed = {};
        mediaData.embed.url = data.url;

         mediaData.domain = data.domain || "";
      } */

      if (
        Object.entries(mediaData).length !== 0 &&
        (mediaData.image || mediaData.video || mediaData.gif)
      ) {
        sources.push(mediaData);
        /* console.log(mediaData); */
      }
    });
    if (!sources.length || (this.state.isOnlyGifsShowing && !weGotGifs)) {
      console.log("RUN IN DATAMAPPER");
      await this.getSubreddit(
        this.shuffleArray(this.dataHandler(this.state.category))
      );
    }

    return;
  };
  switchCatButtons = () => {
    return (
      <React.Fragment>
        <button
          ref={button =>
            button && !this.state.isSearchActivated && button.focus()
          }
          className={`iconLeft`}
        >
          <i onClick={this.goBackToLast} className="material-icons">
            undo
          </i>
        </button>

        <button className={`iconRight`}>
          <i onClick={this.switchCat} className="material-icons">
            shuffle
          </i>
          <p onClick={this.switchCat}>
            Shuffle <br />
            category
          </p>
        </button>
      </React.Fragment>
    );
  };

  imageRatioCalculator = (height, width) => {
    let ratio = height / width;
    if (ratio < 0.7) return "superWide";

    if (ratio >= 0.7 && ratio < 0.9) return "veryWide";

    /*  if (ratio >= 0.7 && ratio < 0.9) return "wide"; */

    if (ratio >= 0.9 && ratio < 1.2) return "rectangular";

    /* if (ratio >= 1.1 && ratio < 1.3) return "tall"; */

    if (ratio >= 1.2 && ratio < 1.5) return "veryTall";

    if (ratio >= 1.5) return "superTall";
  };

  render() {
    // undone bilder visas ändå (https://thumbs.gfycat.com/SneakyDelightfulErmine-size_restricted.gif fåär access denied)

    // code splitting

    return (
      <Swipeable
        className={`wrapper`}
        onKeyDown={this.handleKeyDown}
        onSwipedLeft={this.swipedLeft}
        onSwipedRight={this.swipedRight}
      >
        {/*  {!this.state.isSearchActivated && (
          <button
            className="inputFocus"
            ref={button =>
              button && !this.state.isSearchActivated && button.focus()
            }
          />
        )} */}

        {this.state.category === "No category chosen" ? (
          <div className="categoryModal">
            <div className="grid-container">
              {this.props.match.params.subreddit && (
                <button
                  className="item0"
                  onClick={() => this.setState({ category: "Not chosen" })}
                >
                  Continue to {this.props.match.params.subreddit}
                </button>
              )}
              <button
                className="item1"
                onClick={e => this.changeCat(e, "NSFW")}
              >
                Not safe for work (nudity)
              </button>

              <button
                className="item2"
                onClick={e => this.changeCat(e, "SFWALL")}
              >
                Safe for work
              </button>

              {/* <button
                className="item3"
                onClick={e => this.changeCat(e, "Food")}
              >
                FOOD
              </button>

              <button className="item4" onClick={e => this.changeCat(e, "SFW")}>
                SFW
              </button>

              <button
                className="item5"
                onClick={e => this.changeCat(e, "Animals")}
              >
                ANIMALS
              </button> */}
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
          {/* <div className="middleWrapper">
            <h1 className="scrollLogo">sliddit.</h1>
          </div> */}

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
        <div
          className={`contentZen ${this.state.fullscreenActive &&
            "fullscreen"}`}
        >
          {this.switchCatButtons()}
          {this.state.isLoading ? (
            <div className="spinner">
              <Spin />
              <div className="centered-text">
                Loading <strong>{this.state.subreddit}</strong> category
              </div>
            </div>
          ) : (
            <React.Fragment>
              {sources.length && (
                <AddMarkup
                  isSearchActivated={this.state.isSearchActivated}
                  toggleFullscreen={this.toggleFullscreen}
                  toggleIsLoading={this.toggleIsLoading}
                  mobile={this.state.mobile}
                  isOnlyGifsShowing={this.state.isOnlyGifsShowing}
                  isOnlyPicsShowing={this.state.isOnlyPicsShowing}
                  fullscreen={this.state.fullscreenActive}
                  dataSource={sources}
                  loadMore={this.moreSubreddits}
                  isLoading={this.state.isLoading}
                  isLoadingMore={this.state.isLoadingMore}
                />
              )}
              <div
                style={{ opacity: this.state.isSearchActivated ? 0.1 : 1 }}
                className="subredditNameDiv"
              >
                <h2 className="subredditName">
                  {this.state.subreddit} <Icon type="tag-o" />
                </h2>
              </div>
            </React.Fragment>
          )}
        </div>
      </Swipeable>
    );
  }

  getSubreddit = async (subreddit, notShowLoad) => {
    console.log("GETSUBRREDDITHALLO");
    if (notShowLoad) {
      await this.setState({ subreddit: subreddit, isLoading: false });
    } else {
      await this.setState({ subreddit: subreddit, isLoading: true });
    }

    /* this.state.category === "No category chosen" &&
    !this.props.match.params.subreddit
      ? null
      :  */

    this.props.history.push(`/${this.state.subreddit}`);

    await fetch(
      `https://www.reddit.com/r/${this.state.subreddit}.json?limit=100`
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

      .catch(async () => {
        try {
          await this.getSubreddit(
            this.shuffleArray(this.dataHandler(this.state.category))
          );
        } catch (error) {
          console.log("error", error);
        }
      });

    this.setState({ isLoading: false });
  };

  moreSubreddits = async () => {
    this.setState({ isLoadingMore: true });
    await fetch(
      `https://www.reddit.com/r/${this.state.subreddit}.json?after=${
        this.state.after
      }&limit=100`
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
      });
    this.setState({ isLoadingMore: false });
  };
}

export default Scroller;

/* loadEmbed = (url, domain, embedExists) => {
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
}; */
