import React from "react";
const ConsentForAge = ({ pushToHistory, visible, visibilityChange }) => {
  return (
    visible && (
      <div className="webkitTransform" style={styling.wrapper}>
        <div style={styling.innerWrapper}>
          <div style={{ marginTop: "12vh" }}>
            <span style={styling.span}>This site may include adult content.</span>
            <br />
            <span style={styling.span}>You must be 18+ to enter.</span>
            <br />
            <br />
            <span>Do you want to continue?</span>
            <br />
            <br />
            <button onClick={() => visibilityChange(true)} style={styling.button}>
              No
            </button>
            <button onClick={() => pushToHistory("/subreddits/nsfw")} style={styling.button}>
              Yes
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default ConsentForAge;
const styling = {
  span: {
    fontSize: 16
  },
  wrapper: {
    zIndex: 99999999999999999,
    background: "rgb(20,20,20, 0.2)",
    height: "100vh",
    width: "100vw",
    top: 0,
    left: 0,
    position: "fixed"
  },
  innerWrapper: {
    fontSize: 20,
    zIndex: 99999999999999999,
    borderRadius: 10,
    background: "white",
    opacity: 0.95,
    height: "50vh",
    top: "20vh",
    width: "80vw",
    textAlign: "center",
    position: "fixed",
    color: "black",
    marginLeft: "10vw",
    marginRight: "10vw"
  },
  button: {
    borderRadius: 5,
    fontSize: 16,
    color: "white",
    margin: 5,
    height: 30,
    width: 100,
    backgroundColor: "#40a9ff"
  }
};
