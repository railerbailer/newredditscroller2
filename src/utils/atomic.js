import { subredditArray, straight, artArray, foodArray, animalsArray } from "../subreddits";

export const dataHandler = value => {
  let lowerCaseCategory = value.toLowerCase();
  if (lowerCaseCategory === "nsfw") {
    return straight;
  } else if (lowerCaseCategory === "sfwall") {
    return subredditArray.concat(artArray, foodArray, animalsArray);
  } else if (lowerCaseCategory === "sfw") {
    return subredditArray;
  } else if (lowerCaseCategory === "art") {
    return artArray;
  } else if (lowerCaseCategory === "food") {
    return foodArray;
  } else if (lowerCaseCategory === "animals") {
    return animalsArray;
  } else if (lowerCaseCategory === "search") {
    return subredditArray.concat(artArray, foodArray, animalsArray, straight);
  } else {
    return subredditArray.concat(artArray, foodArray, animalsArray);
  }
};

export const shuffleArray = array => {
  let random = Math.floor(Math.random() * array.length);
  return array[random];
};

export const htmlParser = string => {
  let editedString = "";
  editedString =
    string &&
    string
      .replace(/&gt;/gi, ">")
      .replace(/&lt;/gi, "<")
      .replace(/&amp;/gi, "&");
  return editedString ? editedString : "";
};

export const imageRatioCalculator = (height, width) => {
  let ratio = height / width;
  if (ratio < 0.7) return "superWide";

  if (ratio >= 0.7 && ratio < 0.9) return "veryWide";

  if (ratio >= 0.9 && ratio < 1.2) return "rectangular";

  if (ratio >= 1.2 && ratio < 1.5) return "veryTall";

  if (ratio >= 1.5) return "superTall";
};
