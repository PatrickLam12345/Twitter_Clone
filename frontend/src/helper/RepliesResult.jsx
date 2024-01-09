import { useNavigate } from "react-router-dom";
import TweetText from "./TweetText";
import { useEffect, useState } from "react";
import Like from "./buttons/Like";
import ReplyAsPost from "./buttons/ReplyAsPost";
import Retweet from "./buttons/Retweet";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";

export default function RepliesResult({ tweet }) {
  const userInfo = useSelector(selectUserInfo);
  console.log(tweet);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (tweet && tweet.likes) {
      setLikeCount(tweet.likes.length);
      console.log("Like Count Updated:", tweet.likes.length);
    }
  }, [tweet]);

  useEffect(() => {}, [likeCount]);

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

  return (
    <div>
      <div
        style={{
          boxSizing: "border-box",
          borderTop: "1px solid #333",
        }}
        onClick={() => {
          getTweetChain(tweet.id);
        }}
      >
        <div style={{ padding: "10px" }}>
          <p>
            <span style={{ fontWeight: "bold" }}>{tweet.user.displayName}</span>
            <span style={{ color: "gray", marginLeft: "5px" }}>
              @{tweet.user.username}
            </span>
            <span style={{ marginLeft: "5px" }}>
              - {formatTimeDifference()}
            </span>
          </p>
          <TweetText text={tweet.text} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          padding: "10px",
        }}
      >
        <ReplyAsPost />
        <Retweet />
        <Like userId={userInfo.id} tweetId={tweet.id} likes={likeCount} />
      </div>
    </div>
  );
}
