import React, { Component } from "react";
import Swipeable from "react-swipeable";
import "antd/dist/antd.css";
import "../App.css";
import _ from "lodash";
import { message } from "antd";
import "../App.css";
import { dataHandler, shuffleArray } from "../utils/atomic";
import { carPath } from "../utils/carPath";
import LoginModal from "./loginModal";
import SearchComponent from "./search";
import MainDropDownMenu from "./mainDropDownMenu";
import CardComponent from "./cardComponent";
import GoBackButton from "./goBackButton";

let sources = [];
let goBack = [];
let goBackIndex = 0;
// let reload = 0;
class UserCollectionCards extends Component {
  state = {
    mobile: false,
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
      if (user) {
        this.setState({ user: user });
        this.props.firebase.db.ref(`users/${user.uid}`).on("value", snapshot => {
          const collections = _.get(snapshot.val(), "collections", {});
          this.setState({ userCollections: collections });
          // Object.values(snapshot.val().collections).some(collection => this.props.match.params.collection === collection)
        });
        this.props.firebase.db.ref(`public`).on("value", snapshot => {
          const collections = _.get(snapshot.val(), "collections", {});
          const collectionsArray = _.flatMap(Object.values(collections).map(item => Object.values(item)));
          this.setState({
            publicCollections: collectionsArray
          });
        });
      } else {
        this.setState({ user: null });
      }
    });
    this.setSources([]);
    this.props.match.params.collection &&
      setTimeout(() => this.getCollection(this.props.match.params.collection), 1000);
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
        if (item.title === collection) this.setSources(Object.values(item.data));
      });

    this.toggleIsLoading(false);
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

  switchCat = _.throttle(async () => {
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
      showListInput,
      userCollections,
      activeCollection,
      category,
      user,
      publicCollections
    } = this.state;
    const { firebase } = this.props;
    const data =
      publicCollections &&
      publicCollections.map(collection => {
        const { data = null, title, description, madeBy } = collection;
        return (
          <CardComponent
            key={title + description}
            title={title}
            description={description}
            madeBy={madeBy}
            data={data}
            pushToHistory={this.pushToHistory}
          />
        );
      });
    console.log("publclscs", publicCollections);
    return (
      <Swipeable className={`wrapper`}>
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
        <div className={`userCollectionContent ${fullscreenActive && "fullscreen"}`}>
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
            <div className="cardGrid">{data}</div>
          )}
        </div>
        <React.Fragment>
          <div style={{ opacity: isSearchActivated ? 0.1 : 1 }} className="subredditNameDiv">
            <h2 className="subredditName">
              User Collections
              {/* {activeCollection.length ? activeCollection : collection} <Icon type="tag-o" /> */}
            </h2>
          </div>
        </React.Fragment>
      </Swipeable>
    );
  }
}

export default UserCollectionCards;