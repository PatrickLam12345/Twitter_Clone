import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TweetText from "../helper/TweetText";
import ReplyAsPost from "../helper/buttons/ReplyAsPost";
import Retweet from "../helper/buttons/Retweet";
import Like from "../helper/buttons/Like";
import ReplyBox from "../helper/ReplyBox";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";

export default function TweetChain() {
  const userInfo = useSelector(selectUserInfo);
  const [tweet, setTweet] = useState(null);
  const { tweetId } = useParams();

  const navigate = useNavigate();
  const navProfile = (username) => {
    navigate(`/${username}`);
  };

  const formatTime = (timestamp) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };

    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(timestamp)
    );
  };

  const formatDate = (timestamp) => {
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(
      new Date(timestamp)
    );
  };

  useEffect(() => {
    const fetchTweet = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/getTweetDetails",
          {
            params: {
              id: tweetId,
            },
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
          }
        );
        setTweet(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching tweet replies:", error);
      }
    };

    fetchTweet();
  }, []);

  return (
    <>
      {tweet ? (
        <div
          style={{
            boxSizing: "border-box",
            border: "1px solid #333",
          }}
        >
          <div style={{ padding: "10px" }}>
            <div style={{ display: "inline-block" }}>
              <p
                style={{ fontWeight: "bold" }}
                onClick={() => {
                  navProfile(tweet.user.username);
                }}
              >
                {tweet.user.displayName}
              </p>
              <p
                style={{ color: "gray", marginLeft: "5px" }}
                onClick={() => {
                  navProfile(tweet.user.username);
                }}
              >
                @{tweet.user.username}
              </p>
            </div>
            <TweetText text={tweet.text} />
            <p style={{ color: "gray", marginTop: "5px" }}>
              {formatTime(tweet.date)} · {formatDate(tweet.date)}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                padding: "10px",
              }}
            >
              <ReplyAsPost />
              <Retweet />
              <Like />
            </div>
            <ReplyBox userId={userInfo.id} originalTweetId={tweet.id} />
          </div>
        </div>
      ) : null}
    </>
  );
}
