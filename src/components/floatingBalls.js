import React from "react";
const FloatingBalls = () => {
  return (
    <svg
      style={{ position: "absolute", zIndex: "1" }}
      width="100%"
      height="100%"
      // viewBox="0 0 100% 100%"
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
        fill="none"
        id="verysmallcircle"
      />

      <svg x="60%" y="20">
        <circle cx="10" cy="10" r="10" fill="#01B96B">
          <animateMotion dur="22s" repeatCount="indefinite">
            <mpath xlinkHref="#smallcircle" />
          </animateMotion>
        </circle>

        <circle cx="1" cy="1" r="5" fill="red">
          <animateMotion dur="19s" repeatCount="indefinite">
            <mpath xlinkHref="#strangepath" />
          </animateMotion>
        </circle>
      </svg>
      <svg x="70" y="110">
        <circle cx="5" cy="5" r="5" fill="#40a9ff">
          <animateMotion dur="31s" repeatCount="indefinite">
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
        <circle cx="15" cy="15" r="15" fill="hotpink">
          <animateMotion dur="15s" repeatCount="indefinite">
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
  );
};
export default FloatingBalls;
