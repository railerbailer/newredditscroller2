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
    firebaseId
    // fullscreen
  } = props;

  const menu = () => {
    let collections = props.collections;
    const lists = Object.keys(collections).reverse();
    const srcKey = className === "gif" ? "url" : "low";
    const listMenuItem = lists.map(list => (
      <Menu.Item
        key={list}
        onClick={() => {
          addMediaToCollection({ [firebaseId]: { [className]: { className: ratioClassName, [srcKey]: src } } }, list);
          setDropDown(false);
          message.info(`Added to collection ${list}`);
        }}
      >
        {list}
      </Menu.Item>
    ));
    return (
      <Menu>
        <h4 style={{ marginLeft: "4px" }}>
          <Icon type="bars" /> Add to collection
          <Icon onClick={() => setDropDown(false)} style={{ float: "right", fontSize: 12, margin: 4 }} type="close" />
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
        onClick={() => {
          setDropDown(false);
          toggleFullscreen(index);
        }}
        alt="Could not be loaded"
        className={className}
        ref={img => (this.img = img)}
        src={src}
      />

      <Dropdown overlayClassName="mediaAddDropdown" placement="topRight" visible={isDropDownShowing} overlay={menu()}>
        <div
          onClick={() => setDropDown(!isDropDownShowing)}
          className="addNewMediaIcon"
          onBlur={() => setDropDown(false)}
        >
          <Icon className="addNewMediaIcon" type={isDropDownShowing ? "up" : "plus"} />
        </div>
      </Dropdown>
    </React.Fragment>
  );
};

export default Image;
