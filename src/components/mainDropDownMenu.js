import React from "react";
import { Menu, Button, Icon, Input, Modal, message, Dropdown } from "antd";
import { Link } from "react-router-dom";
const MainDropDownMenu = props => {
  const {
    isOnlyGifsShowing,
    isOnlyPicsShowing,
    category,
    showListInput,
    newListName,
    userCollections,
    activeCollection,
    user,
    isDropDownShowing,
    setSources,
    toggleDropDown,
    toggleIsModalVisible,
    setActiveCollection,
    toggleGifsOnly,
    togglePicsOnly,
    changeCat,
    addNewList,
    setNewListName,
    toggleShowListInput,
    logOut,
    firebase,
    pushToHistory
  } = props;

  const showShareConfirm = collection => {
    const collectionData = userCollections.collections[collection];
    let description = "";
    const addCollectionToPublic = () =>
      firebase.updateCollectionToPublic({
        [collection]: { data: collectionData, description: description }
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
        message.info(`${collection} has been added to public usercollections`);
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
  const { collections = {} } = userCollections;
  const lists = Object.keys(collections).reverse();
  const listMenuItem = lists.map(collection => (
    <Menu.Item style={{ color: activeCollection === collection ? "#1890ff" : "" }} key={collection}>
      <span
        className="collectionNameDropdown"
        onClick={() => {
          setActiveCollection(collection);
          setSources(Object.values(collections[collection]));
          message.info(`Showing your collection: ${collection}`);
          pushToHistory(`/${collection}`);

          toggleDropDown(false);
        }}
      >
        {collection}
      </span>
      {collection !== "Favourites" && (
        <React.Fragment>
          <Icon onClick={() => showDeleteConfirm(collection)} className="deleteCollectionIcon" type="delete" />
          <Icon onClick={() => showShareConfirm(collection)} className="deleteCollectionIcon" type="share-alt" />
        </React.Fragment>
      )}
    </Menu.Item>
  ));
  return (
    <Dropdown
      overlayClassName="dropDownMenu"
      visible={isDropDownShowing}
      onClick={toggleDropDown}
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
              style={{ color: category === "NSFW" ? "#1890ff" : "" }}
              onClick={e => {
                changeCat(e, "NSFW");
                setActiveCollection("");
              }}
            >
              Nsfw
            </div>
          </Menu.Item>
          <Menu.Item>
            <div
              style={{ color: category === "SFWALL" ? "#1890ff" : "" }}
              onClick={e => {
                changeCat(e, "SFWALL");
                setActiveCollection("");
              }}
            >
              Sfw
            </div>
          </Menu.Item>
          <Menu.Divider />
          <h4 style={{ marginLeft: "4px" }}>
            <Link to={`/collections/whatever`}>
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
          <Menu.Item>
            {user ? (
              <div onClick={() => logOut()}>
                <Icon type="logout" /> Log out {user.displayName && `(logged in as ${user.displayName})`}
              </div>
            ) : (
              <div
                onClick={() => {
                  toggleIsModalVisible();
                  toggleDropDown();
                }}
              >
                <Icon type="login" /> Log in
              </div>
            )}
          </Menu.Item>
        </Menu>
      }
    >
      <div className="iconSetting">
        <Icon onBlur={() => toggleDropDown()} type={isDropDownShowing ? "close" : "setting"} className="chooseCat" />
      </div>
    </Dropdown>
  );
};
export default MainDropDownMenu;
