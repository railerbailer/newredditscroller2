import React from "react";
import { Transition } from "react-transition-group";
import { Icon, AutoComplete, Button } from "antd";
const SearchComponent = props => {
  const {
    setAutoCompleteDataSource,
    getSubreddit,
    dataHandler,
    isSearchActivated,
    autoCompleteDataSource,
    toggleSearchButton,
    collectionMode,
    publicCollections
  } = props;
  const handleSearch = value => {
    if (!value) {
      value = "Type your search";
    }
    let searchAbleData = collectionMode
      ? publicCollections.filter(item => item)
      : dataHandler("search");
    let result = searchAbleData.filter(str =>
      str.toLowerCase().includes(value.toLowerCase())
    );
    result = result.reverse();
    result.push(value);
    result = result.reverse();
    setAutoCompleteDataSource(result.slice(0, 7));
  };
  const onSelect = async value => {
    await getSubreddit(value);
    toggleSearchButton(false);
  };
  return (
    <div className="searchWrapper">
      <Transition in={isSearchActivated} unmountOnExit mountOnEnter timeout={0}>
        {status => (
          <AutoComplete
            placeholder={
              collectionMode ? "Search collection" : "Search subreddit"
            }
            autoFocus
            className={`autocomplete--${status}`}
            dataSource={autoCompleteDataSource}
            onBlur={() => toggleSearchButton(false)}
            onSelect={onSelect}
            onSearch={handleSearch}
          />
        )}
      </Transition>

      <Transition
        in={!isSearchActivated}
        unmountOnExit
        mountOnEnter
        timeout={0}
      >
        {status => (
          <Button
            ghost
            className={`searchButton--${status}`}
            onClick={() => toggleSearchButton(true)}
          >
            <Icon type="search" />
          </Button>
        )}
      </Transition>
    </div>
  );
};
export default SearchComponent;
