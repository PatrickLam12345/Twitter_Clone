import { useNavigate } from "react-router-dom";
import TweetText from "./TweetText";
import { useEffect, useState } from "react";
import Like from "./buttons/Like";
import Retweet from "./buttons/Retweet";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";
import Reply from "./buttons/Reply";
import TweetMedia from "./TweetMedia";

export default function TweetResult({ tweet }) {
  const userInfo = useSelector(selectUserInfo);
  console.log(tweet);

  const formatTimeDifference = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(tweet.date)) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    } else if (diffInSeconds < 3600) {
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      return `${diffInMinutes}m`;
    } else if (diffInSeconds < 86400) {
      const diffInHours = Math.floor(diffInSeconds / 3600);
      return `${diffInHours}h`;
    } else if (diffInSeconds < 432000) {
      const diffInDays = Math.floor(diffInSeconds / 86400);
      return `${diffInDays}d ago`;
    } else {
      return new Date(tweet.date).toLocaleString();
    }
  };

  const navigate = useNavigate();
  const getTweetChain = (tweetId) => {
    navigate(`/tweet/${tweetId}`);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      style={{
        boxSizing: "border-box",
        border: "1px solid #333",
        borderTop: "none",
      }}
    >
      <div
        onClick={() => {
          getTweetChain(tweet.id);
        }}
      >
        <div style={{ padding: "10px", marginLeft: "20px" }}>
          <p>
            <span style={{ fontWeight: "bold" }}>{tweet.user.displayName}</span>
            <span style={{ color: "gray", marginLeft: "5px" }}>
              @{tweet.user.username}
            </span>
            <span style={{ marginLeft: "5px" }}>
              - {formatTimeDifference()}
            </span>
          </p>
          <TweetText stopPropagation={stopPropagation} text={tweet.text} />
          {tweet.s3Key && (
            <TweetMedia stopPropagation={stopPropagation} s3Key={tweet.s3Key} />
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        <Reply userId={userInfo.id} tweetId={tweet.id} />
        <Retweet userId={userInfo.id} tweetId={tweet.id} />
        <Like userId={userInfo.id} tweetId={tweet.id} />
      </div>
    </div>
  );
}
