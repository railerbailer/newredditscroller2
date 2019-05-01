import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import React, { Component, Suspense, lazy } from "react";
import trackerHoc from "./components/trackerHoc";
import { carPath } from "./utils/carPath";
import { Helmet } from "react-helmet";

const Scroller = lazy(() => import("./components/scroller"));
const CollectionsScroller = lazy(() => import("./components/collectionsScroller"));
const ChooseCategory = lazy(() => import("./components/chooseCategory"));
const UserCollectionCards = lazy(() => import("./components/userCollectionCards"));
const SubredditsList = lazy(() => import("./components/subredditsList"));
class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Helmet titleTemplate="%s - Sliddit.com" defaultTitle="Sliddit" />
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
            <Route path="/subreddits" exact component={trackerHoc(SubredditsList)} />
            <Route path="/collections" exact component={trackerHoc(UserCollectionCards)} />
            <Route path="/collections/:collection" exact component={trackerHoc(CollectionsScroller)} />
            <Route path="/" exact component={trackerHoc(ChooseCategory)} />
            <Route path="/subreddits/:subreddit" exact component={trackerHoc(Scroller)} />
          </Suspense>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
