import React, { Component } from "react";
import GoogleAnalytics from "react-ga";
import { FirebaseContext } from "../firebase";

GoogleAnalytics.initialize("UA-121718818-1");

const trackerHoc = (WrappedComponent, options = {}) => {
  const trackPage = page => {
    if (process.env.NODE_ENV !== "development") return;
    GoogleAnalytics.set({
      page,
      ...options
    });
    GoogleAnalytics.pageview(page);
  };

  // eslint-disable-next-line
  const HOC = class extends Component {
    componentDidMount() {
      // eslint-disable-next-line
      const page = this.props.location.pathname + this.props.location.search;
      trackPage(page);
    }

    componentDidUpdate(prevProps) {
      const currentPage = prevProps.location.pathname + prevProps.location.search;
      const nextPage = this.props.location.pathname + this.props.location.search;

      if (currentPage !== nextPage) {
        trackPage(nextPage);
      }
    }

    render() {
      return (
        <FirebaseContext.Consumer>
          {firebase => {
            return <WrappedComponent {...this.props} firebase={firebase} />;
          }}
        </FirebaseContext.Consumer>
      );
    }
  };

  return HOC;
};

export default trackerHoc;
