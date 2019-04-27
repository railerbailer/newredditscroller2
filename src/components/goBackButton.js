import React from "react";

const GoBackButton = props => {
  const { goBackFunc } = props;
  return (
    <button onClick={() => goBackFunc()} className="goBackButton">
      <i className="material-icons">arrow_back</i>
    </button>
  );
};
export default GoBackButton;
