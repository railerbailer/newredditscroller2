import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import React, { Component, Suspense, lazy } from "react";
import trackerHoc from "./components/trackerHoc";
import { carPath } from "./utils/carPath";

const Scroller = lazy(() => import("./components/scroller"));
const Collections = lazy(() => import("./components/collectionsScroller"));
const ChooseCategory = lazy(() => import("./components/chooseCategory"));
const userCollectionCards = lazy(() => import("./components/userCollectionCards"));

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense
          fallback={
            <div>
              <div className="suspense">Just Sliddit...</div>
              <svg className="mainSVG" xmlns="http://www.w3.org/2000/svg">
                <path className="carRot" fill="#FFF" d={carPath} />
              </svg>
            </div>
          }
        >
          <Route path="/collections" exact component={trackerHoc(userCollectionCards)} />
          <Route path="/collections/:collection" exact component={trackerHoc(Collections)} />
          <Route path="/" exact component={trackerHoc(ChooseCategory)} />
          <Route path="/:whatever" exact component={trackerHoc(ChooseCategory)} />
          <Route path="/subreddits/:subreddit" exact component={trackerHoc(Scroller)} />
        </Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
