import React from "react";
import { Icon } from "antd";

const GoBackButton = props => {
  const { goBackFunc } = props;
  return (
    <button className="goBackButton">
      <Icon type="arrow-left" onClick={() => goBackFunc()} />
    </button>
  );
};
export default GoBackButton;
