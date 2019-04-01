import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import React, { Component, Suspense, lazy } from "react";

const Scroller = lazy(() => import("./components/scroller"));
class App extends Component {
  componentDidMount() {
    Scroller;
  }
  render() {
    return (
      <BrowserRouter>
        <Suspense
          fallback={
            <div>
              <div className="suspense">
                Loading... <br /> Sliddit.com
              </div>
              <svg className="mainSVG" xmlns="http://www.w3.org/2000/svg">
                <path
                  className="carRot"
                  fill="#FFF"
                  d="M45.6,16.9l0-11.4c0-3-1.5-5.5-4.5-5.5L3.5,0C0.5,0,0,1.5,0,4.5l0,13.4c0,3,0.5,4.5,3.5,4.5l37.6,0
      C44.1,22.4,45.6,19.9,45.6,16.9z M31.9,21.4l-23.3,0l2.2-2.6l14.1,0L31.9,21.4z M34.2,21c-3.8-1-7.3-3.1-7.3-3.1l0-13.4l7.3-3.1
      C34.2,1.4,37.1,11.9,34.2,21z M6.9,1.5c0-0.9,2.3,3.1,2.3,3.1l0,13.4c0,0-0.7,1.5-2.3,3.1C5.8,19.3,5.1,5.8,6.9,1.5z M24.9,3.9
      l-14.1,0L8.6,1.3l23.3,0L24.9,3.9z"
                />
              </svg>
            </div>
          }
        >
          <Route path="/" exact component={Scroller} />
          <Route path="/:subreddit" exact component={Scroller} />
        </Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
