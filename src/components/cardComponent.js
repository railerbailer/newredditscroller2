import React from "react";
import { Card } from "antd";

const CardComponent = props => {
  const { title, madeBy, description, data, pushToHistory } = props;
  const { Meta } = Card;
  const mediaSource = () => {
    if (data && Object.entries(data).length !== 0) {
      const theData = Object.entries(data);
      const filteredData = theData.filter(i => i);
      const firstCell = filteredData[0];
      const mediaData = firstCell[1];
      if (mediaData.image) return ["image", mediaData.image.low];
      if (mediaData.video) return ["video", mediaData.video.url];
      if (mediaData.gif) return ["gif", mediaData.gif.url];
      else return ["none", "www.sliddit.com"];
    }
  };

  const source = () => {
    const sourceData = mediaSource();
    if (sourceData) {
      if (sourceData[0] === "gif" || sourceData[0] === "image") {
        return <img alt="example" src={sourceData[1]} />;
      } else if (sourceData[0] === "video") {
        return (
          <video>
            <source src={`${sourceData[1]}#t=0.1`} type="video/mp4" />
          </video>
        );
      } else {
        return <div>im a div</div>;
      }
    }
  };

  return (
    <Card
      onClick={() => pushToHistory(`/collections/${title}`)}
      className={`card ${mediaSource()[0]}`}
      hoverable
      cover={source()}
    >
      <Meta title={title} description={`${description} Made by: ${madeBy}`} />
    </Card>
  );
};

export default CardComponent;
