import React, { useState } from "react";
import { Icon, Dropdown, Menu, message } from "antd";

const Image = props => {
  const [isDropDownShowing, setDropDown] = useState(false);
  const {
    className,
    src,
    toggleFullscreen,
    index,
    ratioClassName,
    toggleIsModalVisible,
    addMediaToCollection,
    firebaseId,
    fullscreen,
    setLoadedData,
    loadedData,
    permalink,
    title
  } = props;

  const menu = () => {
    let collections = props.collections;
    const lists = Object.keys(collections).reverse();
    const srcKey = className === "gif" ? "url" : "low";
    const listMenuItem = lists.map(list => (
      <Menu.Item
        key={list}
        onClick={() => {
          addMediaToCollection(
            {
              [firebaseId]: {
                title: title || null,
                permalink: permalink || null,
                [className]: {
                  className: ratioClassName,
                  [srcKey]: src
                }
              }
            },
            list
          );
          setDropDown(false);
          message.info(`Added to collection ${list}`);
        }}
      >
        <Icon type="save" />
        {list}
      </Menu.Item>
    ));
    return (
      <Menu>
        <h4 className="addToCollectionModal">
          <Icon type="bank" /> <span>Add to bank</span>
          <Icon
            style={{
              float: "right",
              fontSize: 20,
              padding: "2px 10px 10px 15px"
            }}
            onClick={() => setDropDown(false)}
            type="close"
          />
        </h4>

        {!lists.length && (
          <div onClick={() => toggleIsModalVisible()}>
            <Icon style={{ marginLeft: 4 }} type="login" />
            Log in or register
          </div>
        )}
        {listMenuItem}
      </Menu>
    );
  };

  return (
    <React.Fragment>
      <img
        onBlur={() => setDropDown(false)}
        onLoad={() => setLoadedData(loadedData + 2)}
        onError={() => console.log("Image error")}
        onClick={() => {
          setDropDown(false);
          toggleFullscreen(index);
        }}
        alt="Could not be loaded"
        className={className}
        // ref={img => (this.img = img)}
        src={src}
      />
      {permalink && (
        <a
          rel="noopener noreferrer"
          target="_blank"
          href={permalink}
          style={{ zIndex: fullscreen ? 999 : 5 }}
          className="linkToSource"
        >
          <Icon style={{ zIndex: fullscreen ? 999 : 5 }} type="link" />
        </a>
      )}
      <Dropdown
        overlayStyle={{ zIndex: fullscreen ? 999 : 5 }}
        overlayClassName="mediaAddDropdown"
        placement="topRight"
        visible={isDropDownShowing}
        overlay={menu()}
      >
        <div
          style={{ zIndex: fullscreen ? 999 : 2 }}
          onClick={() => setDropDown(!isDropDownShowing)}
          className="addNewMediaIcon"
          onBlur={() => setDropDown(false)}
        >
          <Icon
            style={{ zIndex: fullscreen ? 999 : 2 }}
            className="addNewMediaIcon"
            type={isDropDownShowing ? "up" : "bank"}
          />
        </div>
      </Dropdown>
    </React.Fragment>
  );
};

export default Image;
