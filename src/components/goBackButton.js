import React from "react";

const GoBackButton = props => {
  const { goBackFunc } = props;
  return (
    <button className="goBackButton">
      <i onClick={() => goBackFunc()} className="material-icons">
        undo
      </i>
    </button>
  );
};
export default GoBackButton;
