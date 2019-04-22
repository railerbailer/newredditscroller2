import React from "react";
const SwitchCategoryButtons = props => {
  const { isSearchActivated, collectionsMode, showListInput, isModalVisible, switchCat } = props;
  const noInputsActivated = !isSearchActivated && !showListInput && !isModalVisible;
  return (
    <button ref={button => button && noInputsActivated && button.focus()} className={`iconRight`}>
      <i onClick={switchCat} className="material-icons">
        shuffle
      </i>
      <p onClick={switchCat}>
        Shuffle <br />
        {collectionsMode ? "collection" : "subreddit"}
      </p>
    </button>
  );
};
export default SwitchCategoryButtons;
