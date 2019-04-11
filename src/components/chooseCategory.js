import React, { Component } from "react";
class ChooseCategory extends Component {
  render() {
    return (
      <div className="categoryModal">
       <h1 className="scrollLogo">sliddit.</h1>
        <div className="grid-container">
        <h2 className="item0">
        
          Scroll more than 1.000.000 of pics and gifs!
          <br/>
          
          <p style={{marginBottom: '-20px', fontSize: '.8em'}}>Pick a domain</p>
          
          
        </h2>
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
