import React from "react";
const ConsentForAge = ({ visible, visibilityChange }) => {
  return (
    visible && (
      <div style={styling.wrapper}>
        <div style={styling.innerWrapper}>
          <div style={{ marginTop: "17vh" }}>
            <strong>Warning: Adult Content</strong>
            <br />
            <span>You must be 18+ to view this community</span>
            <br />
            <span>Do you want to continue?</span>
            <br />
            <br />
            <button
              onClick={() => visibilityChange(true)}
              style={{
                ...styling.button,
                backgroundColor: "#ec6262"
              }}
            >
              Yes
            </button>
            <button
              style={{
                ...styling.button,
                backgroundColor: "#40a9ff"
              }}
            >
              No
            </button>
          </div>
        </div>
      </div>
    )
  );
};
export default ConsentForAge;
const styling = {
  wrapper: {
    zIndex: 99999999999999999,
    background: "transparent",
    height: "100vh",
    width: "100vw"
  },
  innerWrapper: {
    zIndex: 99999999999999999,
    borderRadius: 10,
    opacity: 0.9,
    height: "50vh",
    top: "20vh",
    width: "80vw",
    textAlign: "center",
    position: "fixed",
    color: "black",
    background: "white",
    marginLeft: "10vw",
    marginRight: "10vw"
  },
  button: {
    borderRadius: 5,
    fontSize: 16,
    color: "white",
    margin: 5,
    height: 30,
    width: 100
  }
};
