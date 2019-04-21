import React, { Component } from "react";
import Swipeable from "react-swipeable";
import "antd/dist/antd.css";
import "../App.css";
import { throttle } from "lodash";
import { Transition } from "react-transition-group";
import AddMarkup from "./addMarkup.js";
import { Modal, Input, Icon, Button, message, Menu, Dropdown, AutoComplete } from "antd";
import { Link } from "react-router-dom";
import "../App.css";
import LoginModal from "./loginModal";

let sources = [];
let goBack = [];
let goBackIndex = 0;
let reload = 0;
class Collections extends Component {
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
    dataSource: [],
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
        this.props.firebase.db.ref("public/collections").on("value", snapshot => {
          snapshot.val() && this.setState({ userCollections: snapshot.val() });
          // Object.values(snapshot.val().collections).some(collection => this.props.match.params.subreddit === collection)
        });
      } else {
        this.setState({ user: null });
      }
    });

    this.props.match.params.collection && this.getCollection(this.props.match.params.collection);
  }
  getCollection = () => {
    console.log("lol");
  };
  toggleAuth = () => {
    this.setState({ isAuth: !!this.props.firebase.auth.currentUser });
  };

  switchCat = throttle(async () => {
    this.state.isDropDownShowing && this.toggleDropDown();

    if (goBackIndex >= 0) {
      goBackIndex = goBackIndex - 1;
      if (this.state.activeCollection === goBack[goBack.length - 1 - goBackIndex]) {
        !this.state.isLoading && (await this.getCollection(goBack[goBack.length - goBackIndex]));
      } else !this.state.isLoading && (await this.getCollection(goBack[goBack.length - 1 - goBackIndex]));
    } else {
      !this.state.isLoading && (await this.getCollection(this.shuffleArray(this.state.activeCollection)));
      if (goBackIndex === 0 && goBack[goBack.length - 1] !== this.state.activeCollection) {
        goBack.push(this.state.activeCollection);
      }
    }
  }, 500);

  goBackToLast = () => {
    this.setState({ isVideoLoading: true });
    if (goBack.length > 1 && goBack[0] !== this.state.activeCollection) {
      if (this.state.activeCollection === goBack[goBack.length - 1 - goBackIndex]) {
        this.getCollection(goBack[goBack.length - 2 - goBackIndex]);
      } else this.getCollection(goBack[goBack.length - 1 - goBackIndex]);
    }
    goBackIndex < goBack.length ? (goBackIndex = goBackIndex + 1) : console.log("doing nothin...");

    if (!goBack.includes(this.state.activeCollection)) {
      goBack.push(this.state.activeCollection);
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

  shuffleArray = array => {
    let random = Math.floor(Math.random() * array.length);
    return array[random];
  };

  categorySet = val => {
    this.setState({
      category: val
    });
  };

  handleSearch = value => {
    if (!value) {
      value = "Type your search";
    }

    let result = this.dataHandler("search").filter(str => str.toLowerCase().includes(value.toLowerCase()));
    result = result.reverse();
    result.push(value);
    result = result.reverse();
    this.setState({ dataSource: result.slice(0, 7) });
  };
  onSelect = value => {
    this.getCollection(value);
    this.toggleSearchButton();
  };
  logOut = async () => {
    await this.props.firebase.doSignOut();
    message.info(`Logged out`);
    this.toggleAuth();
    this.toggleDropDown();
  };
  addNewList = () => {
    const { newListName, userCollections } = this.state;
    const { collections = { none: "none" } } = userCollections;
    const nameExists = Object.keys(collections).some(name => name === newListName);
    if (nameExists) {
      alert("You already have a collection with that name");
      return;
    }
    this.props.firebase.updateDataOnUser("collections", { [newListName]: Date.now() });
    this.setState({ showListInput: false, newListName: "" });
  };
  addMediaToCollection = (fields, collection) => {
    console.log("fields", fields);
    console.log("collection", collection);
    this.state.user ? this.props.firebase.pushDataToCollection({ ...fields }, collection) : this.toggleIsModalVisible();
  };

  showShareConfirm = collection => {
    const { userCollections } = this.state;
    const collectionData = Object.values(userCollections.collections[collection]);
    let description;
    const addCollectionToPublic = () =>
      this.props.firebase.setCollectionToPublic({ [collection]: collectionData, description: description });
    const confirm = Modal.confirm;
    confirm({
      title: `Share collection "${collection}"`,
      okText: "Publish",
      content: (
        <React.Fragment>
          <div>Description:</div>
          <Input onChange={e => (description = e.target.value)} prefix={<Icon type="info-circle" />} />
        </React.Fragment>
      ),
      zIndex: 12313123,
      onOk() {
        addCollectionToPublic();
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };
  showDeleteConfirm = collection => {
    const deleteCollection = () => this.props.firebase.removeCollection(collection);
    const confirm = Modal.confirm;
    confirm({
      title: `Are you sure delete ${collection}?`,
      content: "This can not be reversed",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: 12313123,
      onOk() {
        deleteCollection();
        message.info(`${collection} has been deleted`);
      }
      // onCancel() {
      //   console.log("Cancel");
      // }
    });
  };
  menu = () => {
    const {
      isOnlyGifsShowing,
      isOnlyPicsShowing,
      category,
      showListInput,
      newListName,
      userCollections,
      activeCollection,
      user
    } = this.state;
    const filledBgGif = isOnlyGifsShowing ? "#1890ff" : "transparent";
    const filledBgPic = isOnlyPicsShowing ? "#1890ff" : "transparent";
    const { collections = {} } = userCollections;
    const lists = Object.keys(collections).reverse();
    const listMenuItem = lists.map(collection => (
      <Menu.Item style={{ color: activeCollection === collection ? "#1890ff" : "" }} key={collection}>
        <span
          className="collectionNameDropdown"
          onClick={() => {
            this.setState({ activeCollection: collection });
            sources = Object.values(collections[collection]);
            message.info(`Showing your collection: ${collection}`);
            this.props.history.push(`/${collection}`);
            this.toggleDropDown(false);
          }}
        >
          {collection}
        </span>
        {collection !== "Favourites" && (
          <React.Fragment>
            <Icon onClick={() => this.showDeleteConfirm(collection)} className="deleteCollectionIcon" type="delete" />
            <Icon onClick={() => this.showShareConfirm(collection)} className="deleteCollectionIcon" type="share-alt" />
          </React.Fragment>
        )}
      </Menu.Item>
    ));
    return (
      <Menu>
        <Menu.Item disabled>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: "auto 0" }}>Sliddit.menu</h3>
            <span>
              <Button
                onClick={this.toggleGifsOnly}
                style={{ color: "lightgrey", borderRadius: 0, border: 0, backgroundColor: filledBgGif }}
              >
                Gifs
              </Button>
              <Button
                onClick={this.togglePicsOnly}
                style={{ color: "lightgrey", borderRadius: 0, border: 0, backgroundColor: filledBgPic }}
              >
                Pics
              </Button>
              <Icon
                onClick={() => this.toggleDropDown(false)}
                style={{ float: "right", fontSize: 12, margin: 4 }}
                type="close"
              />
            </span>
          </div>
        </Menu.Item>
        <Menu.Divider />
        <h4 style={{ marginLeft: "4px" }}>
          <Link to="/subreddits">
            <Icon type="global" /> Browse subreddits
          </Link>
        </h4>
        <Menu.Item>
          <div
            style={{ color: category === "NSFW" ? "#1890ff" : "" }}
            onClick={e => {
              this.setState({ activeCollection: "" });
            }}
          >
            Nsfw
          </div>
        </Menu.Item>
        <Menu.Item>
          <div
            style={{ color: category === "SFWALL" ? "#1890ff" : "" }}
            onClick={e => {
              this.setState({ activeCollection: "" });
            }}
          >
            Sfw
          </div>
        </Menu.Item>
        <Menu.Divider />
        <h4 style={{ marginLeft: "4px" }}>
          <Link to={`/collections`}>
            <Icon type="solution" /> Browse user collections
          </Link>
        </h4>
        <Menu.Divider />
        <h4 style={{ marginLeft: "4px" }}>
          <Icon type="bars" /> My collections{!user && " (Log in required)"}
        </h4>
        {user && (
          <Menu.Item>
            <Icon
              onClick={() =>
                newListName.length ? this.addNewList() : this.setState({ showListInput: !showListInput })
              }
              type={showListInput ? (newListName.length ? "check" : "close") : "plus-circle"}
            />
            {showListInput && (
              <React.Fragment>
                <Input
                  value={newListName}
                  onChange={event =>
                    this.setState({
                      newListName: event.target.value
                        .replace("]", "")
                        .replace("[", "")
                        .replace("/", "")
                        .replace("$", "")
                        .replace("#", "")
                        .replace(".", "")
                    })
                  }
                  size="small"
                  style={{ maxWidth: "70%" }}
                />{" "}
                {/* <Icon style={{ fontSize: "22px", color: "#1890ff" }} onClick={this.addNewList} type="check" /> */}
              </React.Fragment>
            )}
          </Menu.Item>
        )}
        {user && listMenuItem}
        <Menu.Divider />
        <Menu.Item>
          {user ? (
            <div onClick={() => this.logOut()}>
              <Icon type="logout" /> Log out {user.displayName && `(logged in as ${user.displayName})`}
            </div>
          ) : (
            <div
              onClick={() => {
                this.toggleIsModalVisible();
                this.toggleDropDown();
              }}
            >
              <Icon type="login" /> Log in
            </div>
          )}
        </Menu.Item>
      </Menu>
    );
  };

  switchCatButtons = () => {
    const { isSearchActivated, showListInput, isModalVisible } = this.state;
    const noInputsActivated = !isSearchActivated && !showListInput && !isModalVisible;
    return (
      <React.Fragment>
        <button ref={button => button && noInputsActivated && button.focus()} className={`iconLeft`}>
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

  toggleIsLoading = state => this.setState({ isLoading: state });

  toggleFullscreen = () =>
    !this.state.isSearchActivated && this.setState({ fullscreenActive: !this.state.fullscreenActive });

  toggleIsModalVisible = () => this.setState({ isModalVisible: !this.state.isModalVisible });

  toggleSearchButton = () => this.setState({ isSearchActivated: !this.state.isSearchActivated });

  toggleDropDown = () => {
    this.setState({ isDropDownShowing: !this.state.isDropDownShowing });
  };
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
    await this.getCollection(this.state.activeCollection);
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
    this.getCollection(this.state.activeCollection);
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

  imageRatioCalculator = (height, width) => {
    let ratio = height / width;
    if (ratio < 0.7) return "superWide";

    if (ratio >= 0.7 && ratio < 0.9) return "veryWide";

    if (ratio >= 0.9 && ratio < 1.2) return "rectangular";

    if (ratio >= 1.2 && ratio < 1.5) return "veryTall";

    if (ratio >= 1.5) return "superTall";
  };

  render() {
    let lol = Object.entries(this.state.userCollections).map(user => user);
    console.log("first", lol);
    lol = Object.assign(...lol);
    console.log("assign", lol);
    // const allCollections = Object.values(this.state.userCollections).map(user => Object.values(user).map(next => next));
    // console.log(allCollections);
    // get this.state.userCollections.child("collection").children("all user ids").children("all collections of users")
    const {
      isModalVisible,
      isSearchActivated,
      dataSource,
      isDropDownShowing,
      fullscreenActive,
      isLoading,
      isOnlyGifsShowing,
      isOnlyPicsShowing,
      mobile,
      isLoadingMore,
      showListInput,
      userCollections,
      activeCollection
    } = this.state;
    // console.log(this.state.userCollections.collections[activeCollection]);
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

          <div className="searchWrapper">
            <Transition in={isSearchActivated} unmountOnExit mountOnEnter timeout={0}>
              {status => (
                <AutoComplete
                  placeholder="Search here"
                  autoFocus
                  className={`autocomplete--${status}`}
                  dataSource={dataSource}
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

            <Transition in={!isSearchActivated} unmountOnExit mountOnEnter timeout={0}>
              {status => (
                <Button ghost className={`searchButton--${status}`} onClick={() => this.toggleSearchButton()}>
                  <Icon type="search" />
                </Button>
              )}
            </Transition>
          </div>

          <Dropdown
            overlayClassName="dropDownMenu"
            visible={isDropDownShowing}
            overlay={this.menu()}
            onClick={this.toggleDropDown}
          >
            <div className="iconSetting">
              <Icon
                onBlur={() => this.toggleDropDown()}
                type={isDropDownShowing ? "close" : "setting"}
                className="chooseCat"
              />
            </div>
          </Dropdown>
        </div>
        <div className={`contentZen ${fullscreenActive && "fullscreen"}`}>
          {reload > 6 && (
            <div
              onClick={() => this.getCollection(this.shuffleArray(this.state.activeCollection))}
              style={{
                zIndex: 123123,
                color: "white",
                fontSize: 18,
                position: "fixed",
                left: "calc(50% - 60px)",
                top: "49%",
                textAlign: "center"
              }}
            >
              <Icon style={{ color: "white", fontSize: 30 }} type="disconnect" />
              <p>Press to reload</p>
            </div>
          )}
          {this.switchCatButtons()}
          {isLoading ? (
            <div className="spinner">
              <div className="centered-text">
                <div className="centered-text">
                  Loading <strong>{activeCollection}</strong>
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
                  isLoading={isLoading}
                  isLoadingMore={isLoadingMore}
                />
              )}
              <div style={{ opacity: isSearchActivated ? 0.1 : 1 }} className="subredditNameDiv">
                <h2 className="subredditName">
                  {activeCollection.length ? activeCollection : "No collection chosen"} <Icon type="tag-o" />
                </h2>
              </div>
            </React.Fragment>
          )}
        </div>
      </Swipeable>
    );
  }
}

export default Collections;