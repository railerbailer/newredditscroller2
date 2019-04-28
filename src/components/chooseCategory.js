import React, { Component } from "react";
import FloatingBalls from "./floatingBalls";
import ConsentForAge from "./consentForAge";

class ChooseCategory extends Component {
  state = {
    accepted: false
  };
  pushHistory = subreddit => {
    this.props.history.push(subreddit);
  };
  setAccepted = value => {
    this.setState({ accepted: value });
  };
  render() {
    return (
      <div className="categoryModal">
        <FloatingBalls />
        <h1 className="scrollLogo">sliddit.</h1>
        <ConsentForAge visible={!this.state.accepted} visibilityChange={this.setAccepted} />
        <div className="grid-container">
          <h2 className="item0">
            Scroll more than 1.000.000 of pics and gifs!
            <br />
            <p style={{ marginBottom: "-20px", fontSize: ".8em" }}>Pick a domain</p>
          </h2>
          <button onClick={() => this.pushHistory("/subreddits/nsfw")} className="item1">
            NSFW (18+)
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
        <div
          style={{
            position: "absolute",
            margin: "auto",
            display: "block",
            bottom: 10,
            width: "100%",
            textAlign: "center",
            color: "white"
          }}
        >
          <h3>Save your favorites in collections and share!</h3>
        </div>
      </div>
    );
  }
}

export default ChooseCategory;
