import React, { useState } from "react";
import { Icon, Dropdown, Menu, message } from "antd";

const Image = props => {
  const [isDropDownShowing, setDropDown] = useState(false);
  const { className, src, toggleFullscreen, index } = props;

  const menu = () => {
    const { collections } = props;
    console.log(collections);
    const lists = Object.keys(collections).reverse();
    const listMenuItem = lists.map(list => (
      <Menu.Item
        key={list}
        onClick={() => {
          props.addMediaToCollection(className, src, list);
          setDropDown(false);
          message.info(`Added to collection ${list}`);
        }}
      >
        {list}
      </Menu.Item>
    ));
    return <Menu>{listMenuItem}</Menu>;
  };

  return (
    <React.Fragment>
      <img
        onClick={() => toggleFullscreen(index)}
        alt="Could not be loaded"
        className={className}
        ref={img => (this.img = img)}
        src={src}
      />
      <Dropdown overlayClassName="mediaAddDropdown" placement="topRight" visible={isDropDownShowing} overlay={menu()}>
        <Icon
          onClick={() => setDropDown(!isDropDownShowing)}
          style={{
            position: "absolute",
            zIndex: 2,
            bottom: 5,
            left: 5,
            fontSize: 20,
            opacity: 0.8,
            color: "#1890ff",
            background: "white",
            borderRadius: "100%"
          }}
          type="plus-circle"
        />
      </Dropdown>
    </React.Fragment>
  );
};

export default Image;
