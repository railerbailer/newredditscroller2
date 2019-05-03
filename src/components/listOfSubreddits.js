import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

const ListOfSubreddits = ({ title, subreddits }) => {
  const [showMore, setShowMore] = useState(20);
  const fixedTitle = title
    .toUpperCase()
    .replace("ARRAY", "")
    .replace("NSFW", "")
    .replace("STRAIGHT", "ALL NSFW");

  return (
    <div className="subredditsList">
      <Redirect to="/subreddits" />
      <h2>
        {fixedTitle} ({subreddits.length})
      </h2>
      {subreddits.slice(0, showMore).map((item, i) => (
        <Link key={i} to={`subreddits/${item}`}>
          {item}
        </Link>
      ))}
      {subreddits.length > 20 && (
        <button className="showMoreButton" onClick={() => setShowMore(showMore + 15)}>
          Show more
        </button>
      )}
    </div>
  );
};
export default ListOfSubreddits;
