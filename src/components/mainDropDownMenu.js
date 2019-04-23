import React, { useState } from "react";
import { Menu, Button, Icon, Input, Modal, message, Dropdown } from "antd";
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
    pushToHistory
    // collectionsMode
  } = props;
  const addNewList = () => {
    const nameExists = Object.keys(userCollections).some(name => name === newListName);
    if (nameExists) {
      alert("You already have a collection with that name");
      return;
    }
    firebase.updateDataOnUser("collections", { [newListName]: Date.now() });
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
  const showShareConfirm = collection => {
    const collectionData =
      Object.entries(userCollections[collection]).length !== 0 ? userCollections[collection] : null;
    console.log("collectionsdata", collectionData);
    let description = "";
    const addCollectionToPublic = () =>
      firebase.updateCollectionToPublic({
        [collection]: {
          title: collection,
          data: collectionData,
          description: description,
          madeBy: user.displayName || "anonymous"
        }
      });
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
        toggleDropDown(false);
        message.info(`${collection} has been added to public usercollections`);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };
  const showFeedbackModal = () => {
    const confirm = Modal.confirm;
    let feedbackInput = "";
    confirm({
      title: `Send feedback"`,
      okText: "Send",
      content: (
        <React.Fragment>
          <div>Description:</div>
          <Input onChange={e => (feedbackInput = e.target.value)} prefix={<Icon type="info-circle" />} />
        </React.Fragment>
      ),
      zIndex: 12313123,
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
      zIndex: 12313123,
      onOk() {
        deleteCollection();
        message.info(`${collection} has been deleted`);
      }
    });
  };
  const filledBgGif = isOnlyGifsShowing ? "#1890ff" : "transparent";
  const filledBgPic = isOnlyPicsShowing ? "#1890ff" : "transparent";
  const lists = Object.keys(userCollections).reverse();
  const listMenuItem = lists.map(collection => (
    <Menu.Item style={{ color: activeCollection === collection ? "#1890ff" : "" }} key={collection}>
      <span
        className="collectionNameDropdown"
        onClick={() => {
          setActiveCollection(collection);
          setSources(Object.values(userCollections[collection]));
          message.info(`Showing your collection: ${collection}`);
          pushToHistory(`/collections/${collection}`);

          toggleDropDown(false);
        }}
      >
        {collection}
      </span>
      {collection !== "Favorites" && (
        <React.Fragment>
          <Icon onClick={() => showDeleteConfirm(collection)} className="deleteCollectionIcon" type="delete" />
          {Object.entries(userCollections[collection]).length !== 0 && (
            <Icon onClick={() => showShareConfirm(collection)} className="deleteCollectionIcon" type="share-alt" />
          )}
        </React.Fragment>
      )}
    </Menu.Item>
  ));
  return (
    <Dropdown
      //   trigger={["click", "hover", "contextMenu"]}
      overlayClassName="dropDownMenu"
      visible={isDropDownShowing}
      onClick={() => toggleDropDown(!isDropDownShowing)}
      overlay={
        <Menu>
          <Menu.Item disabled>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ margin: "auto 0" }}>Sliddit.menu</h3>
              <span>
                <Button
                  onClick={toggleGifsOnly}
                  style={{ color: "lightgrey", borderRadius: 0, border: 0, backgroundColor: filledBgGif }}
                >
                  Gifs
                </Button>
                <Button
                  onClick={togglePicsOnly}
                  style={{ color: "lightgrey", borderRadius: 0, border: 0, backgroundColor: filledBgPic }}
                >
                  Pics
                </Button>
                <Icon
                  onClick={() => toggleDropDown(false)}
                  style={{ float: "right", fontSize: 12, margin: 4 }}
                  type="close"
                />
              </span>
            </div>
          </Menu.Item>
          <Menu.Divider />
          <h4 style={{ marginLeft: "4px" }}>
            <Icon type="global" /> Browse subreddits
          </h4>
          <Menu.Item>
            <div
              style={{ color: category === "nsfw" ? "#1890ff" : "" }}
              onClick={() => {
                setActiveCollection("");
                toggleDropDown(false);
                pushToHistory("/subreddits/nsfw");
              }}
            >
              Nsfw
            </div>
          </Menu.Item>
          <Menu.Item>
            <div
              style={{ color: category === "sfw" ? "#1890ff" : "" }}
              onClick={() => {
                pushToHistory("/subreddits/sfw");
                toggleDropDown(false);
                setActiveCollection("");
              }}
            >
              Sfw
            </div>
          </Menu.Item>
          <Menu.Divider />
          <h4 style={{ marginLeft: "4px" }}>
            <Link style={{ color: "mediumvioletred" }} to={`/collections`}>
              <Icon type="solution" /> Browse user collections (click here)
            </Link>
          </h4>
          <Menu.Divider />
          <h4 style={{ marginLeft: "4px" }}>
            <Icon type="bars" /> My collections{!user && " (Log in required)"}
          </h4>
          {user && (
            <Menu.Item>
              <Icon
                onClick={() => (newListName.length ? addNewList() : toggleShowListInput(!showListInput))}
                type={showListInput ? (newListName.length ? "check" : "close") : "plus-circle"}
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
                <Icon type="logout" /> Log out {user.displayName && `(logged in as ${user.displayName})`}
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
      }
    >
      <div className="iconSetting">
        <Icon type={isDropDownShowing ? "close" : "setting"} className="chooseCat" />
      </div>
    </Dropdown>
  );
};
export default MainDropDownMenu;
