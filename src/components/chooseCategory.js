import React, { Component } from "react";
import FloatingBalls from "./floatingBalls";
class ChooseCategory extends Component {
  state = {
    dataSource: []
  };

  pushHistory = subreddit => {
    this.props.history.push(subreddit);
  };

  render() {
    return (
      <div className="categoryModal">
        <FloatingBalls />
        <h1 className="scrollLogo">sliddit.</h1>
        <div className="grid-container">
          <h2 className="item0">
            Scroll more than 1.000.000 of pics and gifs!
            <br />
            <p style={{ marginBottom: "-20px", fontSize: ".8em" }}>Pick a domain</p>
          </h2>
          <button
            onClick={() => {
              this.pushHistory("/subreddits/nsfw");
            }}
            className="item1"
          >
            Not safe for work (18+)
          </button>

          <button
            onClick={() => {
              this.pushHistory("/subreddits/sfw");
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
