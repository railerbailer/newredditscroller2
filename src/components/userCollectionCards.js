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

class UserCollectionCards extends Component {
  state = {
    mobile: false,
    isLoadingMore: false,
    autoPlayVideo: true,
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
    publicCollections: [],
    collectionsToRemake: []
  };

  componentWillMount() {
    if (window.screen.availWidth < 800) this.setState({ mobile: true });
  }
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(user => {
      this.props.firebase.db.ref("users").on("value", snapshot => {
        let collectionsArray = [];
        const snapshotValues = snapshot.val();
        Object.entries(snapshotValues).forEach(([id, userCollections]) =>
          Object.values(userCollections).forEach(userCollectionsDeep => {
            userCollectionsDeep.Favorites !== "set at creation" &&
              Object.entries(userCollectionsDeep).forEach(([name, userCollection]) =>
                collectionsArray.push({
                  title: name + " " + id,
                  data: userCollection
                })
              );
          })
        );
        this.setState({
          publicCollections: collectionsArray
        });
      });
      if (user) {
        this.setState({ user: user });
        this.props.firebase.db.ref(`users/${user.uid}`).on("value", snapshot => {
          const collections = _.get(snapshot.val(), "collections", {});
          this.setState({ userCollections: collections });
        });
      } else {
        this.setState({ user: null });
      }
    });

    if (this.props.match.params.collection) {
      setTimeout(() => this.getCollection(this.props.match.params.collection), 1500);
    }
  }
  getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  };
  getCollection = collection => {
    this.toggleIsLoading(true);
    this.setActiveCollection(collection);
    const { userCollections } = this.state;
    if (userCollections[collection]) {
      this.toggleIsLoading(false);
      return;
    }

    this.toggleIsLoading(false);
    return;
  };
  setNewListName = listName => this.setState({ newListName: listName });
  toggleAutoPlayVideo = bool => this.setState({ autoPlayVideo: bool });
  toggleShowListInput = bool => this.setState({ showListInput: bool });
  setActiveCollection = collection => this.setState({ activeCollection: collection });
  toggleIsLoading = state => this.setState({ isLoading: state });
  toggleFullscreen = () =>
    !this.state.isSearchActivated &&
    this.setState({ fullscreenActive: !this.state.fullscreenActive });
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
    await this.getCollection(shuffleArray(this.state.publicCollections));
  }, 500);

  changeCat = (e, cat) => {
    this.categorySet(cat);
    this.getCollection(shuffleArray(this.state.publicCollections));
    message.info(`Category is ${cat}, press or swipe right to shuffle collection`);
    this.setState({ isDropDownShowing: false });
  };
  addMediaToCollection = (fields, collection) => {
    this.state.user
      ? this.props.firebase.updateDataToCollection({ ...fields }, collection)
      : this.toggleIsModalVisible();
  };
  goBackinHistory = _.throttle(() => this.props.history.goBack(), 500);
  render() {
    const {
      // isModalVisible,
      isSearchActivated,
      isDropDownShowing,
      autoCompleteDataSource,
      fullscreenActive,
      // isLoading,
      // collection,
      isOnlyGifsShowing,
      isOnlyPicsShowing,
      // mobile,
      showListInput,
      userCollections,
      activeCollection,
      category,
      user,
      publicCollections,
      autoPlayVideo
    } = this.state;
    const { firebase } = this.props;
    const data =
      publicCollections &&
      publicCollections.map((collection, i) => {
        const {
          data = null,
          title = "User collection" + this.getRandomInt(1000),
          description = ""
          // madeBy = "",
          // accepted = true
        } = collection;

        return (
          <CardComponent
            key={title + i}
            title={title}
            description={description}
            madeBy={"Anonymous"}
            data={data}
            pushToHistory={this.pushToHistory}
          />
        );
      });
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
          <GoBackButton goBackFunc={this.goBackinHistory} />
          <MainDropDownMenu
            autoPlayVideo={autoPlayVideo}
            toggleAutoPlayVideo={this.toggleAutoPlayVideo}
            setSources={() => {}}
            collectionsMode={true}
            isDropDownShowing={isDropDownShowing}
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
        <div
          onClick={() => this.toggleDropDown(false)}
          className={`userCollectionContent ${fullscreenActive && "fullscreen"}`}
        >
          {!data.length ? (
            <div className="spinner">
              <div className="centered-text">
                <div className="centered-text">
                  Loading <strong>public user banks</strong>
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
              User banks
              {/* {activeCollection.length ? activeCollection : collection} <Icon type="tag-o" /> */}
            </h2>
          </div>
        </React.Fragment>
      </Swipeable>
    );
  }
}

export default UserCollectionCards;
