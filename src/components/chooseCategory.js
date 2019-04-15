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
        <svg
          style={{ position: "absolute", zIndex: "1" }}
          width="100%"
          height="100%"
          viewBox="0 0 100% 100%"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <path
            d="
            M10,110 
            A120,120 -45 0,1 110 10 
            A120,120 -45 0,1 10,110"
            stroke="none"
            stroke-width="2"
            fill="none"
            id="strangepath"
          />
          <path
            d="
           M 100, 100
           m -75, 0
           a 75,75 0 1,0 150,0
           a 75,75 0 1,0 -150,0
       "
            stroke="none"
            stroke-width="2"
            fill="none"
            id="largecircle"
          />
          <path
            d="
           M 100, 100
           m -75, 0
           a 35,35 0 1,0 70,0
           a 35,35 0 1,0 -70,0
       "
            stroke="none"
            stroke-width="2"
            fill="none"
            id="smallcircle"
          />
          <path
            d="
           M 80, 50
           m -75, 0
           a 10,10 0 1,0 20,0
           a 10,10 0 1,0 -20,0
       "
            stroke="none"
            stroke-width="2"
            fill="none"
            id="verysmallcircle"
          />

          <svg x="60%" y="20">
            <circle cx="10" cy="10" r="10" fill="green">
              <animateMotion dur="22s" repeatCount="indefinite">
                <mpath xlinkHref="#smallcircle" />
              </animateMotion>
            </circle>

            <circle cx="" cy="" r="5" fill="red">
              <animateMotion dur="19s" repeatCount="indefinite">
                <mpath xlinkHref="#strangepath" />
              </animateMotion>
            </circle>
          </svg>
          <svg x="70" y="110">
            <circle cx="5" cy="5" r="5" fill="blue">
              <animateMotion dur="30s" repeatCount="indefinite">
                <mpath xlinkHref="#strangepath" />
              </animateMotion>
            </circle>
          </svg>
          <svg x="80%" y="30%">
            <circle cx="15" cy="15" r="15" fill="lightgreen">
              <animateMotion dur="30s" repeatCount="indefinite">
                <mpath xlinkHref="#strangepath" />
              </animateMotion>
            </circle>
          </svg>
          <svg x="0" y="0">
            <circle cx="15" cy="15" r="15" fill="purple">
              <animateMotion dur="30s" repeatCount="indefinite">
                <mpath xlinkHref="#verysmallcircle" />
              </animateMotion>
            </circle>
          </svg>
          <svg x="10%" y="60%">
            <circle cx="15" cy="15" r="15" fill="yellow">
              <animateMotion dur="30s" repeatCount="indefinite">
                <mpath xlinkHref="#smallcircle" />
              </animateMotion>
            </circle>
          </svg>
          <svg x="70%" y="60%">
            <circle cx="15" cy="15" r="15" fill="orange">
              <animateMotion dur="15s" repeatCount="indefinite">
                <mpath xlinkHref="#verysmallcircle" />
              </animateMotion>
            </circle>
          </svg>
        </svg>
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
