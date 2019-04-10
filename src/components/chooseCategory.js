import React, { Component } from "react";
class ChooseCategory extends Component {
  render() {
    return (
      <div className="categoryModal">
        <h2>
        Welcome to Sliddit.com!
        <br/>
          Scroll more than 1.000.000 of pics and gifs!
          <br/>
          <br/>
          Pick a domain
          
          
        </h2>
        <div className="grid-container">
          <button
            onClick={() => {
              this.props.history.push("/nsfw");
            }}
            className="item1"
          >
            Not safe for work (18+)
          </button>

          <button
            onClick={() => {
              this.props.history.push("/sfw", "HEY THERE");
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
