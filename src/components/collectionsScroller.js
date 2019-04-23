import React, { Component } from "react";
import Swipeable from "react-swipeable";
import "antd/dist/antd.css";
import "../App.css";
import _ from "lodash";
import AddMarkup from "./addMarkup";
import { Icon, message } from "antd";
import "../App.css";
import { dataHandler, shuffleArray } from "../utils/atomic";
import { carPath } from "../utils/carPath";
import LoginModal from "./loginModal";
import SearchComponent from "./search";
import SwitchCategoryButtons from "./switchCategoryButtons";
import MainDropDownMenu from "./mainDropDownMenu";
import GoBackButton from "./goBackButton";

let sources = [];
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
    showListInput: false,
    newListName: "",
    userCollections: { Loading: "kek" },
    user: null,
    activeCollection: "",
    publicCollections: []
  };

  componentWillMount() {
    if (window.screen.availWidth < 800) this.setState({ mobile: true });
  }
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(user => {
      this.props.firebase.db.ref(`public`).on("value", snapshot => {
        const collections = _.get(snapshot.val(), "collections", {});
        const collectionsArray = _.flatMap(Object.values(collections).map(item => Object.values(item)));
        this.setState({
          publicCollections: collectionsArray
        });
      });
      if (user) {
        this.setState({ user: user });
        this.props.firebase.db.ref(`users/${user.uid}`).on("value", snapshot => {
          const collections = _.get(snapshot.val(), "collections", {});
          this.setState({ userCollections: collections });
          // Object.values(snapshot.val().collections).some(collection => this.props.match.params.collection === collection)
        });
      } else {
        this.setState({ user: null });
      }
    });

    // if (dataHandler("nsfw").includes(this.props.match.params.collection)) {
    //   this.setState({ category: "nsfw" });
    // }
    if (this.props.match.params.collection) {
      this.toggleIsLoading(true);
      setTimeout(() => this.getCollection(this.props.match.params.collection), 2000);
    }
  }
  getCollection = collection => {
    this.toggleIsLoading(true);
    this.setActiveCollection(collection);
    const { publicCollections, userCollections } = this.state;
    if (userCollections[collection]) {
      this.setSources(Object.values(userCollections[collection]));
      this.toggleIsLoading(false);
      return;
    } else
      publicCollections.map(item => {
        if (item.title === collection) return this.setSources(Object.values(item.data));
        else return null;
      });

    this.toggleIsLoading(false);
    return;
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
  categorySet = val => this.setState({ category: val });
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

  switchCat = _.throttle(async () => {
    window.stop();
    this.toggleDropDown(false);
    this.setActiveCollection("");

    return await this.getCollection(shuffleArray(Object.keys(this.state.publicCollections)));
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
    this.getCollection(shuffleArray(this.state.publicCollections));
    message.info(`Category is ${cat}, press or swipe right to shuffle collection`);
    this.setState({ isDropDownShowing: false });
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
      user,
      publicCollections
    } = this.state;
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
            collectionMode={true}
            publicCollections={publicCollections.map(item => item.title)}
            setAutoCompleteDataSource={this.setAutoCompleteDataSource}
            getSubreddit={this.getCollection}
            dataHandler={dataHandler}
            isSearchActivated={isSearchActivated}
            autoCompleteDataSource={autoCompleteDataSource}
            toggleSearchButton={this.toggleSearchButton}
          />
          <GoBackButton goBackFunc={this.props.history.goBack} />
          <MainDropDownMenu
            collectionsMode={true}
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
            collectionsMode={true}
            isSearchActivated={isSearchActivated}
            showListInput={showListInput}
            isModalVisible={isModalVisible}
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
                  collectionsMode={true}
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
