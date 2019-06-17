import React, { useState } from "react";
import { Menu, Button, Icon, Input, Modal, message, Drawer } from "antd";
import { Link } from "react-router-dom";
const MainDropDownMenu = props => {
  const [newListName, setNewListName] = useState("");

  const {
    toggleGifsOnly,
    togglePicsOnly,
    toggleIsModalVisible,
    setSources,
    setActiveCollection,
    toggleShowListInput,
    isOnlyGifsShowing,
    isOnlyPicsShowing,
    showListInput,
    category,
    userCollections,
    activeCollection,
    user,
    isDropDownShowing,
    toggleDropDown,
    firebase,
    pushToHistory,
    changeCat,
    autoPlayVideo,
    toggleAutoPlayVideo
    // collectionsMode
  } = props;
  const addNewList = async () => {
    const nameExists = Object.keys(userCollections).some(name => name === newListName);
    if (nameExists) {
      alert("You already have a collection with that name");
      return;
    }
    await firebase.updateDataOnUser("collections", { [newListName]: Date.now() });

    toggleShowListInput(false);
    setNewListName("");
  };

  const logOut = async () => {
    await firebase.doSignOut();
    message.info(`Logged out`);
    toggleDropDown(false);
  };
  const saveFeedback = input => {
    firebase.pushFeedback(input);
  };
  const showLink = async collection => {
    const collectionData =
      Object.entries(userCollections[collection]).length !== 0 ? userCollections[collection] : null;
    await firebase.updateCollectionToPublic({
      [collection]: {
        accepted: false,
        title: collection,
        data: collectionData,
        madeBy: user.displayName || "anonymous"
      }
    });
    const urlToCollection = `https://www.sliddit.com/collections/${collection} ${user.uid}`;
    const confirm = Modal.success;
    confirm({
      title: `Shareable link to "${collection}"`,
      content: (
        <React.Fragment>
          <a style={{ fontSize: 10 }} href={urlToCollection}>
            {urlToCollection}
          </a>
        </React.Fragment>
      ),
      zIndex: 999999999999
    });
  };
  // const showShareConfirm = collection => {
  //   const collectionData =
  //     Object.entries(userCollections[collection]).length !== 0 ? userCollections[collection] : null;
  //   let description = "";
  //   const addCollectionToPublic = () =>
  //     firebase.updateCollectionToPublic({
  //       [collection]: {
  //         accepted: true,
  //         title: collection,
  //         data: collectionData,
  //         description: description,
  //         madeBy: user.displayName || "anonymous"
  //       }
  //     });
  //   const removeCollectionFromPublic = () =>
  //     firebase.updateCollectionToPublic({
  //       [collection]: {
  //         accepted: false,
  //         title: collection,
  //         data: collectionData,
  //         description: description,
  //         madeBy: user.displayName || "anonymous"
  //       }
  //     });
  //   const confirm = Modal.confirm;
  //   confirm({
  //     title: `Share collection "${collection}"`,
  //     okText: "Publish",
  //     content: (
  //       <React.Fragment>
  //         <div>Description:</div>
  //         <Input
  //           onChange={e => (description = e.target.value)}
  //           prefix={<Icon type="info-circle" />}
  //         />
  //       </React.Fragment>
  //     ),
  //     zIndex: 999999999999,
  //     onOk() {
  //       addCollectionToPublic();
  //       toggleDropDown(false);
  //       message.info(`${collection} has been added to public usercollections`);
  //     },
  //     cancelText: "Unpublish",
  //     onCancel() {
  //       removeCollectionFromPublic();
  //     }
  //   });
  // };
  const showFeedbackModal = () => {
    const confirm = Modal.confirm;
    let feedbackInput = "";
    confirm({
      title: `Send feedback"`,
      okText: "Send",
      content: (
        <React.Fragment>
          <div>Description:</div>
          <Input
            onChange={e => (feedbackInput = e.target.value)}
            prefix={<Icon type="info-circle" />}
          />
        </React.Fragment>
      ),
      zIndex: 999999999999,
      onOk() {
        saveFeedback(feedbackInput);
        toggleDropDown(false);
        message.info(`"${feedbackInput}" has been recieved, thank you!`);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };

  const showDeleteConfirm = collection => {
    const deleteCollection = () => firebase.removeCollection(collection);
    const confirm = Modal.confirm;
    confirm({
      title: `Are you sure delete ${collection}?`,
      content: "This can not be reversed",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      zIndex: 999999999999,
      onOk() {
        deleteCollection();
        message.info(`${collection} has been deleted`);
      }
    });
  };
  const filledBgGif = isOnlyGifsShowing ? "#1890ff" : "transparent";
  const filledBgPic = isOnlyPicsShowing ? "#1890ff" : "transparent";
  const filledBgAutoPlayVideo = autoPlayVideo ? "#1890ff" : "transparent";
  const lists = Object.keys(userCollections).reverse();
  const listMenuItem = lists.map(collection => (
    <Menu.Item
      style={{
        color: activeCollection === collection ? "#1890ff" : "",
        display: "flex",
        justifyContent: "space-between"
      }}
      key={collection}
    >
      <span
        className="collectionNameDropdown"
        onClick={() => {
          if (Object.entries(userCollections[collection]).length !== 0) {
            setActiveCollection(collection);
            setSources(Object.values(userCollections[collection]));
            message.info(`Showing your collection: ${collection}`);
            pushToHistory(`/collections/${collection}`);
            toggleDropDown(false);
          }
        }}
      >
        <Icon className="drawerListIcon" type="right" />
        {collection}
      </span>
      {collection !== "Favorites" && (
        <span className="collectionIcons">
          {Object.entries(userCollections[collection]).length !== 0 && (
            <React.Fragment>
              <Icon
                onClick={() => showLink(collection)}
                className="deleteCollectionIcon"
                type="link"
              />
              {/* <Icon
                onClick={() => showShareConfirm(collection)}
                className="deleteCollectionIcon"
                type="share-alt"
              /> */}
            </React.Fragment>
          )}
          <Icon
            onClick={() => showDeleteConfirm(collection)}
            className="deleteCollectionIcon"
            type="delete"
          />
        </span>
      )}
    </Menu.Item>
  ));
  return (
    <React.Fragment>
      <div
        style={{ marginRight: isDropDownShowing ? "300px" : "0" }}
        className="iconSetting"
        onClick={() => toggleDropDown(!isDropDownShowing)}
      >
        <Icon type={isDropDownShowing ? "menu-unfold" : "menu-fold"} className="chooseCat" />
      </div>
      <Drawer
        zIndex={99999999999}
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ margin: "auto 12px auto 0px" }}>Sliddit.menu</h3>
            <span>
              <Button
                onClick={toggleGifsOnly}
                style={{
                  color: "lightgrey",
                  borderRadius: 0,
                  borderRight: 0,
                  backgroundColor: filledBgGif
                }}
              >
                Gifs
              </Button>
              <Button
                onClick={togglePicsOnly}
                style={{ color: "lightgrey", borderRadius: 0, backgroundColor: filledBgPic }}
              >
                Pics
              </Button>
              <Button
                onClick={() => {
                  toggleAutoPlayVideo(!autoPlayVideo);
                  toggleDropDown(false);
                }}
                style={{
                  color: "lightgrey",
                  borderRadius: 0,
                  backgroundColor: filledBgAutoPlayVideo
                }}
              >
                Autoplay gifs
              </Button>
              <Icon
                onClick={() => toggleDropDown(false)}
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  fontSize: 22,
                  margin: "-6px -6px 12px 12px"
                }}
                type="close"
              />
            </span>
          </div>
        }
        placement={"right"}
        closable={false}
        onClose={() => toggleDropDown(!isDropDownShowing)}
        visible={isDropDownShowing}
        bodyStyle={{ padding: 0 }}
        width={300}
      >
        <Menu>
          <Menu.Item onClick={() => pushToHistory("/subreddits")}>
            <h4>
              <Icon type="global" /> Browse all subreddits
            </h4>
          </Menu.Item>
          <Menu.Item
            style={{ color: category === "nsfw" ? "#1890ff" : "" }}
            onClick={() => {
              setActiveCollection("");
              toggleDropDown(false);
              pushToHistory("/subreddits/nsfw");
              changeCat && changeCat("", "nsfw");
            }}
          >
            <div>
              <Icon type="star" />
              Browse NSFW
            </div>
          </Menu.Item>
          <Menu.Item
            style={{ color: category === "sfw" ? "#1890ff" : "" }}
            onClick={() => {
              pushToHistory("/subreddits/sfw");
              toggleDropDown(false);
              setActiveCollection("");
              changeCat && changeCat("", "sfw");
            }}
          >
            <div>
              <Icon type="heart" />
              Browse SFW
            </div>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item>
            <h4>
              <Link style={{ color: "rgba(0, 0, 0, 0.85)" }} to={`/collections`}>
                <Icon type="solution" /> Browse user banks
              </Link>
            </h4>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item>
            <h4>
              <Icon type="bank" /> My banks{!user && " (Log in required)"}
            </h4>
          </Menu.Item>
          {user && (
            <Menu.Item>
              <Icon
                onClick={() =>
                  newListName.length ? addNewList() : toggleShowListInput(!showListInput)
                }
                type={
                  showListInput
                    ? newListName.length
                      ? "check-circle"
                      : "close-circle"
                    : "plus-circle"
                }
                style={{ color: newListName.length ? "green" : "black" }}
              />
              {showListInput && (
                <React.Fragment>
                  <Input
                    value={newListName}
                    onChange={event =>
                      setNewListName(
                        event.target.value
                          .replace("]", "")
                          .replace("[", "")
                          .replace("/", "")
                          .replace("$", "")
                          .replace("#", "")
                          .replace(".", "")
                          .replace(" ", "")
                      )
                    }
                    size="small"
                    style={{ maxWidth: "70%" }}
                  />
                </React.Fragment>
              )}
            </Menu.Item>
          )}
          {user && listMenuItem}
          <Menu.Divider />
          <Menu.Item onClick={showFeedbackModal}>
            <Icon type="bulb" />
            Feedback
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item>
            {user ? (
              <div onClick={() => logOut()}>
                <Icon type="logout" /> Log out{" "}
                {user.displayName && `(logged in as ${user.displayName})`}
              </div>
            ) : (
              <div
                onClick={() => {
                  toggleIsModalVisible();
                }}
              >
                <Icon onClick={() => toggleDropDown(false)} type="login" /> Log in or register
              </div>
            )}
          </Menu.Item>
        </Menu>
      </Drawer>
    </React.Fragment>
  );
};
export default MainDropDownMenu;
