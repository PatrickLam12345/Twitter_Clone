import { useNavigate } from "react-router-dom";
import TweetText from "./TweetText";
import { useEffect, useState } from "react";
import Like from "./buttons/Like";
import Retweet from "./buttons/Retweet";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";
import Reply from "./buttons/Reply";
import TweetMedia from "./TweetMedia";
import TweetProfile from "./TweetProfile";

export default function TweetResult({ tweet }) {
  const userInfo = useSelector(selectUserInfo);

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
        <div
          style={{ padding: "10px", marginLeft: "20px", marginRight: "20px" }}
        >
          <p>
            <TweetProfile
              stopPropagation={stopPropagation}
              displayName={tweet.user.displayName}
              username={tweet.user.username}
              date={tweet.date}
            />
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
