import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import React, { Component, Suspense, lazy } from "react";
import trackerHoc from "./components/trackerHoc";
import { carPath } from "./utils/carPath";
import { Helmet } from "react-helmet";

function retry(fn, retriesLeft = 5, interval = 1000) {
  return new Promise((resolve, reject) => {
    fn()
      .then(resolve)
      .catch(error => {
        setTimeout(() => {
          if (retriesLeft === 1) {
            // reject('maximum retries exceeded');
            reject(error);
            return;
          }

          // Passing on "reject" is the important part
          retry(fn, retriesLeft - 1, interval).then(resolve, reject);
        }, interval);
      });
  });
}

const Scroller = lazy(() => import("./components/scroller"));
const CollectionsScroller = lazy(() => retry(() => import("./components/collectionsScroller")));
const ChooseCategory = lazy(() => import("./components/chooseCategory"));
const UserCollectionCards = lazy(() => retry(() => import("./components/userCollectionCards")));
const SubredditsList = lazy(() => retry(() => import("./components/subredditsList")));
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
            <Route
              path="/collections/:collection"
              exact
              component={trackerHoc(CollectionsScroller)}
            />
            <Route path="/" exact component={trackerHoc(ChooseCategory)} />
            <Route path="/subreddits/:subreddit" exact component={trackerHoc(Scroller)} />
          </Suspense>
        </BrowserRouter>
      </React.Fragment>
    );
  }
}

export default App;
