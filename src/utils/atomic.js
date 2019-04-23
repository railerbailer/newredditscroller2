import { gifsArray, subredditArray, straight, artArray, foodArray, animalsArray } from "../subreddits";
import _ from "lodash";

export const dataHandler = value => {
  let lowerCaseCategory = value.toLowerCase();
  if (lowerCaseCategory === "nsfw") {
    return _.uniq(straight);
  } else if (lowerCaseCategory === "sfw") {
    return _.uniq(subredditArray.concat(artArray, foodArray, animalsArray));
  }
  //else if (lowerCaseCategory === "sfw") {
  //   return subredditArray;
  // }
  else if (lowerCaseCategory === "art") {
    return artArray;
  } else if (lowerCaseCategory === "food") {
    return foodArray;
  } else if (lowerCaseCategory === "animals") {
    return animalsArray;
  } else if (lowerCaseCategory === "search") {
    return _.uniq(subredditArray.concat(artArray, foodArray, animalsArray, straight, gifsArray));
  } else {
    return _.uniq(subredditArray.concat(artArray, foodArray, animalsArray, gifsArray));
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

export const dataMapper = async (fetchedData, mobile) => {
  let convertedSources = [];
  fetchedData.map((item, i) => {
    let mediaData = {};
    const { data } = item;
    const {
      preview,
      post_hint,
      /*  media,
      media_embed, */
      thumbnail_height = 1,
      thumbnail_width = 2,
      thumbnail
    } = data;
    const isGif = data.url.includes(".gif");

    if (preview && preview.reddit_video_preview && preview.reddit_video_preview.scrubber_media_url) {
      imageRatioCalculator(preview.reddit_video_preview.height, preview.reddit_video_preview.width);
      mediaData.video = {};
      mediaData.video.url = preview.reddit_video_preview.scrubber_media_url;
      mediaData.video.height = preview.reddit_video_preview.height;
      mediaData.video.width = preview.reddit_video_preview.width;
      mediaData.video.className = imageRatioCalculator(
        preview.reddit_video_preview.height,
        preview.reddit_video_preview.width
      );
      let low = "";
      const { resolutions } = preview.images[0];
      low = htmlParser(resolutions[resolutions.length - 1].url || "");
      if (low) {
        mediaData.video.image = low;
      }
      mediaData.video.poster = data.thumbnail;
      mediaData.domain = data.domain || "";
      mediaData.title = data.title;
      mediaData.thumbnail = thumbnail;
    } else if (isGif) {
      mediaData.gif = {};
      mediaData.gif.url = data.url.replace(".gifv", ".gif");
      mediaData.gif.className = imageRatioCalculator(thumbnail_height, thumbnail_width);
      mediaData.domain = data.domain || "";
      mediaData.title = data.title;
      mediaData.thumbnail = thumbnail;
    } else if (post_hint === "image") {
      mediaData.image = {};
      let low;
      let high;
      preview &&
        preview.images[0] &&
        preview.images[0].resolutions.map(resolution => {
          let res = resolution.height + resolution.width;
          if (res > 500 && res < 1000) {
            low = htmlParser(resolution.url);
          }
          if (res > 1000 && res < 2000) {
            high = htmlParser(resolution.url);
          }

          mediaData.image = {
            source: data.url,
            low: low,
            high: high,
            className: imageRatioCalculator(resolution.height, resolution.width)
          };
          if (mobile && (!high && !low)) {
            mediaData.image = null;
          }
          return null;
        });
      mediaData.domain = data.domain || "";
      mediaData.title = data.title;
      mediaData.thumbnail = thumbnail;
    }
    if (Object.entries(mediaData).length !== 0 && (mediaData.image || mediaData.video || mediaData.gif)) {
      convertedSources.push(mediaData);
    }
    return null;
  });
  // if (!sources.length || (this.state.isOnlyGifsShowing && !weGotGifs)) {
  //   await this.getSubreddit(shuffleArray(dataHandler(this.state.category)));
  // }

  return convertedSources;
};
