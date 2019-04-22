import React from "react";
const SwitchCategoryButtons = props => {
  const { isSearchActivated, collectionsMode, showListInput, isModalVisible, goBackToLast, switchCat } = props;
  const noInputsActivated = !isSearchActivated && !showListInput && !isModalVisible;
  return (
    <React.Fragment>
      <button ref={button => button && noInputsActivated && button.focus()} className={`iconLeft`}>
        <i onClick={goBackToLast} className="material-icons">
          undo
        </i>
      </button>

      <button className={`iconRight`}>
        <i onClick={switchCat} className="material-icons">
          shuffle
        </i>
        <p onClick={switchCat}>
          Shuffle <br />
          {collectionsMode ? "collection" : "subreddit"}
        </p>
      </button>
    </React.Fragment>
  );
};
export default SwitchCategoryButtons;
