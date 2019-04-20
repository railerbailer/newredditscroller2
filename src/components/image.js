import React, { useState } from "react";
import { Icon, Dropdown, Menu, message } from "antd";

const Image = props => {
  const [isDropDownShowing, setDropDown] = useState(false);
  const { className, src, toggleFullscreen, index, ratioClassName, toggleIsModalVisible, addMediaToCollection } = props;

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
        <Icon onClick={() => setDropDown(!isDropDownShowing)} className="addNewMediaIcon" type="plus" />
      </Dropdown>
    </React.Fragment>
  );
};

export default Image;
