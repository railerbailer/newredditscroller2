import React, { Component } from "react";
import Swipeable from "react-swipeable";
import "antd/dist/antd.css";
import "../App.css";
import { throttle } from "lodash";
import AddMarkup from "./addMarkup";
import { Icon, message } from "antd";
import "../App.css";
import { dataHandler, shuffleArray, dataMapper } from "../utils/atomic";
import LoginModal from "./loginModal";
import SearchComponent from "./search";
import SwitchCategoryButtons from "./switchCategoryButtons";
import MainDropDownMenu from "./mainDropDownMenu";

let sources = [];
let goBack = [];
let goBackIndex = 0;
let reload = 0;
class Scroller extends Component {
  state = {
    mobile: false,
    load: "not ok",
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
    isAuth: false,
    showListInput: false,
    newListName: "",
    userCollections: { Loading: "kek" },
    user: null,
    activeCollection: ""
  };

  componentWillMount() {
    if (window.screen.availWidth < 800) this.setState({ mobile: true });
  }
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: user });
        this.props.firebase.db.ref(`users/${user.uid}`).on("value", snapshot => {
          snapshot.val() && this.setState({ userCollections: snapshot.val() });
          // Object.values(snapshot.val().collections).some(collection => this.props.match.params.subreddit === collection)
        });
      } else {
        this.setState({ user: null });
      }
    });

    if (dataHandler("nsfw").includes(this.props.match.params.subreddit)) {
      this.setState({ category: "nsfw" });
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
  toggleAuth = () => this.setState({ isAuth: !!this.props.firebase.auth.currentUser });
  categorySet = val => this.setState({ category: val });
  setAutoCompleteDataSource = value => this.setState({ autoCompleteDataSource: value });
  toggleDropDown = () => this.setState({ isDropDownShowing: !this.state.isDropDownShowing });
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

  switchCat = throttle(async () => {
    window.stop();
    this.state.isDropDownShowing && this.toggleDropDown();
    this.setActiveCollection("");
    if (goBackIndex >= 0) {
      goBackIndex = goBackIndex - 1;
      if (this.state.subreddit === goBack[goBack.length - 1 - goBackIndex]) {
        !this.state.isLoading && (await this.getSubreddit(goBack[goBack.length - goBackIndex]));
      } else !this.state.isLoading && (await this.getSubreddit(goBack[goBack.length - 1 - goBackIndex]));
    } else {
      !this.state.isLoading && (await this.getSubreddit(shuffleArray(dataHandler(this.state.category))));
      if (goBackIndex === 0 && goBack[goBack.length - 1] !== this.state.subreddit) {
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
    goBackIndex < goBack.length ? (goBackIndex = goBackIndex + 1) : console.log("doing nothin...");

    if (!goBack.includes(this.state.subreddit)) {
      goBack.push(this.state.subreddit);
    }
  };

  handleKeyDown = e => {
    if (e.key === "ArrowLeft") {
      this.goBackToLast();
    }
    if (e.key === "Escape") {
      this.setState({ fullscreenActive: false });
    }
    if (e.key === "a") {
      this.goBackToLast();
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
      this.goBackToLast();
    }
  };

  changeCat = (e, cat) => {
    this.categorySet(cat);
    this.getSubreddit(shuffleArray(dataHandler(cat)));
    message.info(`Category is ${cat}, press or swipe right to shuffle subreddit`);
    this.setState({ isDropDownShowing: false });
  };

  logOut = async () => {
    await this.props.firebase.doSignOut();
    message.info(`Logged out`);
    this.toggleAuth();
    this.toggleDropDown();
  };
  setNewListName = listName => this.setState({ newListName: listName });
  toggleShowListInput = bool => this.setState({ showListInput: bool });
  addNewList = () => {
    const { newListName, userCollections } = this.state;
    const { collections = { none: "none" } } = userCollections;
    const nameExists = Object.keys(collections).some(name => name === newListName);
    if (nameExists) {
      alert("You already have a collection with that name");
      return;
    }
    this.props.firebase.updateDataOnUser("collections", { [newListName]: Date.now() });
    this.toggleShowListInput(false);
    this.setNewListName("");
  };
  addMediaToCollection = (fields, collection) => {
    console.log("fields", fields);
    console.log("collection", collection);
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
      newListName,
      user
    } = this.state;
    const { collections = {} } = userCollections;
    const { firebase } = this.props;

    return (
      <Swipeable
        className={`wrapper`}
        onKeyDown={
          !isModalVisible && !isModalVisible && !showListInput && !isSearchActivated ? this.handleKeyDown : undefined
        }
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
          <MainDropDownMenu
            isDropDownShowing={isDropDownShowing}
            setSources={this.setSources}
            isOnlyGifsShowing={isOnlyGifsShowing}
            isOnlyPicsShowing={isOnlyPicsShowing}
            category={category}
            showListInput={showListInput}
            newListName={newListName}
            userCollections={userCollections}
            activeCollection={activeCollection}
            user={user}
            toggleDropDown={this.toggleDropDown}
            toggleIsModalVisible={this.toggleIsModalVisible}
            setActiveCollection={this.setActiveCollection}
            toggleGifsOnly={this.toggleGifsOnly}
            togglePicsOnly={this.togglePicsOnly}
            changeCat={this.changeCat}
            addNewList={this.addNewList}
            setNewListName={this.setNewListName}
            toggleShowListInput={this.toggleShowListInput}
            logOut={this.logOut}
            firebase={firebase}
            pushToHistory={this.pushToHistory}
          />
        </div>
        <div className={`contentZen ${fullscreenActive && "fullscreen"}`}>
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
            goBackToLast={this.goBackToLast}
            switchCat={this.switchCat}
          />

          {isLoading ? (
            <div className="spinner">
              <div className="centered-text">
                <div className="centered-text">
                  Loading <strong>{subreddit}</strong>
                </div>
              </div>
              <div className="carSpinner">
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
              <br />
              <br />
            </div>
          ) : (
            <React.Fragment>
              {sources.length && (
                <AddMarkup
                  toggleIsModalVisible={this.toggleIsModalVisible}
                  activeCollection={this.state.activeCollection}
                  collections={collections}
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
    await this.setState({ subreddit: subreddit, isLoading: !notShowLoad });
    sources = [];
    await fetch(`https://www.reddit.com/r/${this.state.subreddit}.json?limit=100`)
      .then(response => response.json())
      .then(async jsonData => {
        reload = 0;
        this.setState({
          after: jsonData.data.after
        });
        sources = await dataMapper(jsonData.data.children, this.state.mobile);
        const haveVideoOrGif = sources.length && sources.some(media => media.gif || media.video);
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
    this.pushToHistory(`/${this.state.subreddit}`);
    this.setState({ isLoading: false });
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
        const haveVideoOrGif = afterData.length && afterData.some(media => media.gif || media.video);
        sources = sources.concat(afterData);
      })
      .catch(error => {
        console.log("error", error);
      });
    this.setState({ isLoadingMore: false });
  };
}

export default Scroller;
