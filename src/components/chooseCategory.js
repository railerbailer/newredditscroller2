import React, { Component } from "react";
import {
  subredditArray,
  straight,
  artArray,
  foodArray,
  animalsArray
} from "../subreddits";
// import { AutoComplete } from "antd";
const subreddits = subredditArray.concat(
  straight,
  artArray,
  foodArray,
  animalsArray
);
class ChooseCategory extends Component {
  state = {
    dataSource: []
  };
  handleSearch = value => {
    if (!value) {
      value = "Type your search";
    }
    let result = subreddits.filter(str =>
      str.toLowerCase().includes(value.toLowerCase())
    );
    result = result.reverse();
    result.push(value);
    result = result.reverse();
    this.setState({ dataSource: result.slice(0, 7) });
  };
  onSelect = value => {
    this.pushHistory(value);
  };

  pushHistory = subreddit => {
    this.props.history.push(subreddit);
  };
  // <div style={{ color: "white !important", zIndex: 123123123123, background: 'red', height: '500px' }}>
  // <AutoComplete
  //   placeholder="Search here"
  //   autoFocus
    
  //   dataSource={["this.state.dataSource", "two", "three"]}
  //   onSelect={this.onSelect}
  //   onSearch={this.handleSearch}
  // />
  render() {
    return (
      <div className="categoryModal">
        <h1 className="scrollLogo">sliddit.</h1>
        <div className="grid-container">
          <h2 className="item0">
            Scroll more than 1.000.000 of pics and gifs!
            <br />
            <p style={{ marginBottom: "-20px", fontSize: ".8em" }}>
              Pick a domain
            </p>
          </h2>
          <button
            onClick={() => {
              this.pushHistory("nsfw");
            }}
            className="item1"
          >
            Not safe for work (18+)
          </button>

          <button
            onClick={() => {
              this.pushHistory("imaginarylandscapes");
            }}
            className="item2"
          >
            Safe for work
          </button>
        </div>
      </div>
    );
  }
}

export default ChooseCategory;
