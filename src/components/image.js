import React, { useState } from "react";
import { Icon, Dropdown, Menu, message } from "antd";

const Image = props => {
  const [isDropDownShowing, setDropDown] = useState(false);
  const { className, src, toggleFullscreen, index, ratioClassName, addMediaToCollection } = props;

  const menu = () => {
    let collections = props.collections;
    const lists = Object.keys(collections).reverse();
    const listMenuItem = lists.map(list => (
      <Menu.Item
        key={list}
        onClick={() => {
          addMediaToCollection({ [className]: { className: ratioClassName, low: src } }, list);
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
          <Icon type="bars" /> My collections
        </h4>
        <h5 style={{ padding: "5%" }}> Add to collection </h5>
        {listMenuItem}
      </Menu>
    );
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

      <Dropdown
        onBlur={() => setTimeout((() => setDropDown(false), 500))}
        overlayClassName="mediaAddDropdown"
        placement="topRight"
        visible={isDropDownShowing}
        overlay={menu()}
      >
        <Icon onClick={() => setDropDown(!isDropDownShowing)} className="addNewMediaIcon" type="plus-circle" />
      </Dropdown>
    </React.Fragment>
  );
};

export default Image;
