import React, { Component } from "react";
import Swipeable from "react-swipeable";
import "antd/dist/antd.css";
import "../App.css";
import { throttle } from "lodash";
import AddMarkup from "./addMarkup";
import { Icon, message } from "antd";
import "../App.css";
import { dataHandler, shuffleArray, dataMapper } from "../utils/atomic";
import { carPath } from "../utils/carPath";
import LoginModal from "./loginModal";
import SearchComponent from "./search";
import SwitchCategoryButtons from "./switchCategoryButtons";
import MainDropDownMenu from "./mainDropDownMenu";

let sources = [];
let goBack = [];
let goBackIndex = 0;
let reload = 0;
class CollectionsScroller extends Component {
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
    collection: "",
    after: "",
    category: "",
    isModalVisible: false,
    isAuth: false,
    showListInput: false,
    newListName: "",
    userCollections: { Loading: "kek" },
    user: null,
    activeCollection: "",
    publicCollections: ["test1", "test2"]
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
          // Object.values(snapshot.val().collections).some(collection => this.props.match.params.collection === collection)
        });
      } else {
        this.setState({ user: null });
      }
    });

    // if (dataHandler("nsfw").includes(this.props.match.params.collection)) {
    //   this.setState({ category: "nsfw" });
    // }
    this.props.match.params.collection && this.getCollection(this.props.match.params.collection);
  }
  getCollection = collection => {
    console.log(collection);
    return [];
  };
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
    await this.getCollection(this.state.collection);
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
    this.getCollection(this.state.collection);
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
      if (this.state.collection === goBack[goBack.length - 1 - goBackIndex]) {
        !this.state.isLoading && (await this.getCollection(goBack[goBack.length - goBackIndex]));
      } else !this.state.isLoading && (await this.getCollection(goBack[goBack.length - 1 - goBackIndex]));
    } else {
      !this.state.isLoading && (await this.getCollection(shuffleArray(this.state.publicCollections)));
      if (goBackIndex === 0 && goBack[goBack.length - 1] !== this.state.collection) {
        goBack.push(this.state.collection);
      }
    }
  }, 500);

  goBackToLast = () => {
    this.setState({ isVideoLoading: true });
    if (goBack.length > 1 && goBack[0] !== this.state.collection) {
      if (this.state.collection === goBack[goBack.length - 1 - goBackIndex]) {
        this.getCollection(goBack[goBack.length - 2 - goBackIndex]);
      } else this.getCollection(goBack[goBack.length - 1 - goBackIndex]);
    }
    goBackIndex < goBack.length ? (goBackIndex = goBackIndex + 1) : console.log("doing nothin...");

    if (!goBack.includes(this.state.collection)) {
      goBack.push(this.state.collection);
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
    this.getCollection(shuffleArray(this.state.publicCollections));
    message.info(`Category is ${cat}, press or swipe right to shuffle collection`);
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
      collection,
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
            getSubreddit={this.getCollection}
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
              onClick={() => this.getCollection(shuffleArray(userCollections.collection))}
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
                  Loading <strong>{collection}</strong>
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
                  {activeCollection.length ? activeCollection : collection} <Icon type="tag-o" />
                </h2>
              </div>
            </React.Fragment>
          )}
        </div>
      </Swipeable>
    );
  }
}

export default CollectionsScroller;
