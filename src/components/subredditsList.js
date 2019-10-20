import React from "react";

import {
  gifsArray,
  sfwarray,
  straight,
  artArray,
  foodArray,
  animalsArray,
  alternativeNSFW,
  amateurNSFW,
  tattooNSFW,
  collegeNSFW,
  gonewildNSFW,
  selfieNSFW,
  analNSFW,
  buttplugNSFW,
  assNSFW,
  athleticNSFW,
  fatNSFW,
  bigdickNSFW,
  bimboNSFW,
  boobsNSFW,
  titfuckNSFW,
  sexyclothingNSFW,
  cuckoldNSFW,
  otherNSFW,
  bdsmNSFW,
  indianNSFW,
  blackNSFW,
  asianNSFW,
  cumNSFW,
  pornnetworksNSFW
} from "../subreddits";
import { Helmet } from "react-helmet";
import ListOfSubreddits from "./listOfSubreddits";
import GoBackButton from "./goBackButton";
const SubredditsList = props => {
  const allCategories = {
    gifsArray,
    sfwarray,
    straight,
    artArray,
    foodArray,
    animalsArray,
    alternativeNSFW,
    amateurNSFW,
    tattooNSFW,
    collegeNSFW,
    gonewildNSFW,
    selfieNSFW,
    analNSFW,
    buttplugNSFW,
    assNSFW,
    athleticNSFW,
    fatNSFW,
    bigdickNSFW,
    bimboNSFW,
    boobsNSFW,
    titfuckNSFW,
    sexyclothingNSFW,
    cuckoldNSFW,
    otherNSFW,
    bdsmNSFW,
    indianNSFW,
    blackNSFW,
    asianNSFW,
    cumNSFW,
    pornnetworksNSFW
  };
  return (
    <>
      <Helmet>
        <title>List of subreddits</title>
        <meta name="description" content="List of more than 1000 subreddits" />
        <meta
          name="keywords"
          content={Object.values(allCategories)
            .flatMap(item => item)
            .join(", ")}
        />
      </Helmet>
      <GoBackButton goBackFunc={props.history.goBack} />
      <h1 style={{ color: "white", textAlign: "center" }}>All subreddits</h1>
      <div className="subredditsListWrapper">
        {Object.entries(allCategories).map((category, i) => {
          return (
            <ListOfSubreddits
              key={i}
              title={category[0]}
              subreddits={category[1]}
            />
          );
        })}
      </div>
    </>
  );
};
export default SubredditsList;
