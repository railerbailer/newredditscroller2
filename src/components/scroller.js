import React, { Component } from "react";
import Swipeable from "react-swipeable";
import "antd/dist/antd.css";
import "../App.css";
import _ from "lodash";
import AddMarkup from "./addMarkup";
import { Icon, message } from "antd";
import "../App.css";
import { dataHandler, shuffleArray, dataMapper } from "../utils/atomic";
import { carPath } from "../utils/carPath";
import LoginModal from "./loginModal";
import SearchComponent from "./search";
import SwitchCategoryButtons from "./switchCategoryButtons";
import MainDropDownMenu from "./mainDropDownMenu";
import GoBackButton from "./goBackButton";

let sources = [];
let reload = 0;
class Scroller extends Component {
  state = {
    mobile: false,
    errorMessage: "",
    isLoadingMore: false,
    fullscreenActive: false,
    isDropDownShowing: false,
    isLoading: false,
    isOnlyGifsShowing: false,
    isOnlyPicsShowing: false,
    isSearchActivated: false,
    autoCompleteDataSource: [],
    subreddit: "",
    after: "",
    category: "",
    isModalVisible: false,
    showListInput: false,
    newListName: "",
    userCollections: { Loading: "kek" },
    user: null,
    activeCollection: ""
  };

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.isLoading && prevProps.match.params.subreddit !== this.props.match.params.subreddit) {
      this.getSubreddit(this.props.match.params.subreddit);
      this.categorySet(this.props.match.params.subreddit);
    }
  }

  componentWillMount() {
    if (window.screen.availWidth < 800) this.setState({ mobile: true });
  }
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
        this.props.firebase.db.ref(`users/${user.uid}`).on("value", snapshot => {
          const collections = _.get(snapshot.val(), "collections", {});
          snapshot.val() && this.setState({ userCollections: collections });
          // Object.values(snapshot.val().collections).some(collection => this.props.match.params.subreddit === collection)
        });
        // this.props.firebase.db.ref(`public`).on("value", snapshot => {
        //   const collections = _.get(snapshot.val(), "collections", {});
        //   const collectionsArray = _.flatMap(Object.values(collections).map(item => Object.values(item)));
        //   this.setState({
        //     publicCollections: collectionsArray
        //   });
        // });
      } else {
        this.setState({ user: null });
      }
    });

    if (dataHandler("nsfw").includes(this.props.match.params.subreddit)) {
      this.categorySet("nsfw");
    }
    this.props.match.params.subreddit && this.getSubreddit(this.props.match.params.subreddit);
  }

  setSources = value => (sources = value);
  setNewListName = listName => this.setState({ newListName: listName });
  toggleShowListInput = bool => this.setState({ showListInput: bool });
  setActiveCollection = collection => this.setState({ activeCollection: collection });
  toggleIsLoading = state => this.setState({ isLoading: state });
  toggleFullscreen = () =>
    !this.state.isSearchActivated && this.setState({ fullscreenActive: !this.state.fullscreenActive });
  toggleIsModalVisible = () => this.setState({ isModalVisible: !this.state.isModalVisible });
  toggleSearchButton = value => this.setState({ isSearchActivated: value });
  categorySet = val => this.setState({ category: val });
  setErrorMessage = value => {
    this.setState({ errorMessage: value });
  };
  setAutoCompleteDataSource = value => this.setState({ autoCompleteDataSource: value });
  toggleDropDown = value => this.setState({ isDropDownShowing: value });
  toggleGifsOnly = async () => {
    this.setState({
      isOnlyGifsShowing: !this.state.isOnlyGifsShowing
    });
    setTimeout(
      () =>
        this.setState({
          isDropDownShowing: false
        }),
      1500
    );
    await this.getSubreddit(this.state.subreddit);
  };
  togglePicsOnly = () => {
    this.setState({
      isOnlyPicsShowing: !this.state.isOnlyPicsShowing
    });
    setTimeout(
      () =>
        this.setState({
          isDropDownShowing: false
        }),
      1500
    );
    this.getSubreddit(this.state.subreddit);
  };
  pushToHistory = route => {
    this.props.history.push(route);
  };

  switchCat = _.throttle(async () => {
    this.toggleIsLoading(true);
    window.stop();
    this.toggleDropDown(false);
    this.setActiveCollection("");

    !this.state.isLoading && (await this.getSubreddit(shuffleArray(dataHandler(this.state.category))));

    this.toggleIsLoading(false);
  }, 500);

  handleKeyDown = e => {
    if (e.key === "ArrowLeft") {
      this.props.history.goBack();
    }
    if (e.key === "Escape") {
      this.setState({ fullscreenActive: false });
    }
    if (e.key === "a") {
      this.props.history.goBack();
    }

    if (e.key === "ArrowRight") {
      this.switchCat();
    }
    if (e.key === "d") {
      this.switchCat();
    }
  };

  swipedLeft = (e, absX, isFlick) => {
    if (isFlick || absX > 30) {
      this.switchCat();
    }
  };

  swipedRight = (e, absX, isFlick) => {
    if (isFlick || absX > 30) {
      this.props.history.goBack();
    }
  };

  changeCat = (e, cat) => {
    this.categorySet(cat);
    this.getSubreddit(shuffleArray(dataHandler(cat)));
    message.info(`Category is ${cat}, press or swipe right to shuffle subreddit`);
    this.setState({ isDropDownShowing: false });
  };

  addMediaToCollection = (fields, collection) => {
    this.state.user
      ? this.props.firebase.updateDataToCollection({ ...fields }, collection)
      : this.toggleIsModalVisible();
  };

  render() {
    const {
      isModalVisible,
      isSearchActivated,
      isDropDownShowing,
      autoCompleteDataSource,
      fullscreenActive,
      isLoading,
      subreddit,
      isOnlyGifsShowing,
      isOnlyPicsShowing,
      mobile,
      isLoadingMore,
      showListInput,
      userCollections,
      activeCollection,
      category,
      user,
      errorMessage
    } = this.state;
    const { firebase } = this.props;

    return (
      <Swipeable
        className={`wrapper`}
        onKeyDown={!isModalVisible && !showListInput && !isSearchActivated ? this.handleKeyDown : undefined}
        onSwipedLeft={this.swipedLeft}
        onSwipedRight={this.swipedRight}
      >
        <div className="topbarZen">
          <LoginModal
            firebase={firebase}
            toggleIsModalVisible={this.toggleIsModalVisible}
            isModalVisible={this.state.isModalVisible}
          />
          <SearchComponent
            setAutoCompleteDataSource={this.setAutoCompleteDataSource}
            getSubreddit={this.getSubreddit}
            dataHandler={dataHandler}
            isSearchActivated={isSearchActivated}
            autoCompleteDataSource={autoCompleteDataSource}
            toggleSearchButton={this.toggleSearchButton}
          />
          <GoBackButton goBackFunc={this.props.history.goBack} />
          <MainDropDownMenu
            isDropDownShowing={isDropDownShowing}
            setSources={this.setSources}
            isOnlyGifsShowing={isOnlyGifsShowing}
            isOnlyPicsShowing={isOnlyPicsShowing}
            category={category}
            showListInput={showListInput}
            userCollections={userCollections}
            activeCollection={activeCollection}
            user={user}
            toggleDropDown={this.toggleDropDown}
            toggleIsModalVisible={this.toggleIsModalVisible}
            setActiveCollection={this.setActiveCollection}
            toggleGifsOnly={this.toggleGifsOnly}
            togglePicsOnly={this.togglePicsOnly}
            changeCat={this.changeCat}
            toggleShowListInput={this.toggleShowListInput}
            firebase={firebase}
            pushToHistory={this.pushToHistory}
          />
        </div>
        <div onClick={() => this.toggleDropDown(false)} className={`contentZen ${fullscreenActive && "fullscreen"}`}>
          {reload > 6 && (
            <div
              onClick={() => this.getSubreddit(shuffleArray(dataHandler(this.state.category)))}
              className="internetProblemReload"
            >
              <Icon style={{ color: "white", fontSize: 30 }} type="disconnect" />
              <p>Press to reload</p>
            </div>
          )}
          <SwitchCategoryButtons
            isSearchActivated={isSearchActivated}
            showListInput={showListInput}
            isModalVisible={isModalVisible}
            switchCat={this.switchCat}
          />

          {isLoading ? (
            <div className="spinner">
              <div className="centered-text">
                <div className="centered-text">
                  {errorMessage.length ? errorMessage : "Loading"} <strong>{subreddit}</strong>
                </div>
              </div>
              <div className="carSpinner">
                <svg xmlns="http://www.w3.org/2000/svg">
                  <path fill="#FFF" d={carPath} />
                </svg>
              </div>
              <br />
              <br />
            </div>
          ) : (
            <React.Fragment>
              {sources.length && (
                <AddMarkup
                  toggleIsModalVisible={this.toggleIsModalVisible}
                  activeCollection={this.state.activeCollection}
                  collections={userCollections}
                  addMediaToCollection={this.addMediaToCollection}
                  isSearchActivated={isSearchActivated}
                  toggleFullscreen={this.toggleFullscreen}
                  toggleIsLoading={this.toggleIsLoading}
                  mobile={mobile}
                  isOnlyGifsShowing={isOnlyGifsShowing}
                  isOnlyPicsShowing={isOnlyPicsShowing}
                  fullscreen={fullscreenActive}
                  dataSource={sources}
                  loadMore={this.moreSubreddits}
                  isLoading={isLoading}
                  isLoadingMore={isLoadingMore}
                />
              )}
              <div style={{ opacity: isSearchActivated ? 0.1 : 1 }} className="subredditNameDiv">
                <h2 className="subredditName">
                  {activeCollection.length ? activeCollection : subreddit} <Icon type="tag-o" />
                </h2>
              </div>
            </React.Fragment>
          )}
        </div>
      </Swipeable>
    );
  }

  getSubreddit = async (subreddit, notShowLoad) => {
    await this.setState({ errorMessage: "", subreddit: subreddit, isLoading: !notShowLoad });
    sources = [];
    await fetch(`https://www.reddit.com/r/${this.state.subreddit}.json?limit=100`)
      .then(response => response.json())
      .then(async jsonData => {
        reload = 0;
        this.setState({
          after: jsonData.data.after
        });
        sources = await dataMapper(jsonData.data.children, this.state.mobile);
        // const haveVideoOrGif = sources.length && sources.some(media => media.gif || media.video);
      })

      .catch(async () => {
        try {
          reload = reload + 1;
          if (reload < 10) await this.getSubreddit(shuffleArray(dataHandler(this.state.category)));
          else alert("Could not load data, check your internet connection");
        } catch (error) {
          console.log("error", error);
        }
      });
    if (!sources.length) {
      this.setErrorMessage("Sorry! No media in");
      await this.getSubreddit(shuffleArray(dataHandler(this.state.category)));
    } else {
      this.pushToHistory(`/subreddits/${this.state.subreddit}`);
      this.setState({ isLoading: false });
    }
  };

  moreSubreddits = async () => {
    this.setState({ isLoadingMore: true });
    await fetch(`https://www.reddit.com/r/${this.state.subreddit}.json?after=${this.state.after}&limit=100`)
      .then(response => response.json())
      .then(async jsonData => {
        this.setState({
          after: jsonData.data.after
        });
        let afterData = await dataMapper(jsonData.data.children, this.state.mobile);
        // const haveVideoOrGif = afterData.length && afterData.some(media => media.gif || media.video);
        sources = sources.concat(afterData);
      })
      .catch(error => {
        console.log("error", error);
      });
    this.setState({ isLoadingMore: false });
  };
}

export default Scroller;
