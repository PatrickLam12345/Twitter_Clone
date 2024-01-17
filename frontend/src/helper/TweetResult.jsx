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
import axios from "axios";

export default function TweetResult({ tweet }) {
  const userInfo = useSelector(selectUserInfo);
  const [loadingState, setLoadingState] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  useEffect(() => {
    const getS3Image = async () => {
      try {
        const response = await axios.get(
          "https://twitterclonebackend2024.onrender.com/api/user/getS3Media",
          {
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
            params: {
              s3Key: tweet.user.s3Key,
            },
            responseType: "arraybuffer",
          }
        );
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
        setLoadingState(true);
      } catch (error) {
        console.error("Error Fetching:", error);
      }
    };

    getS3Image();
  }, []);

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
      return new Date(date).toLocaleString();
    }
  };

  const handleOnClick = (e) => {
    stopPropagation(e);
    navigate(`/${username}`);
  };

  const navigate = useNavigate();
  const getTweetChain = (tweetId) => {
    navigate(`/tweet/${tweetId}`);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    loadingState && (
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
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div style={{ width: "50px", textAlign: "center" }}>
                <img
                  onClick={(e) => handleOnClick(e)}
                  src={imageSrc}
                  style={{ height: "50px", width: "auto", maxWidth: "50px" }}
                  alt="S3 Image"
                />
              </div>
              {tweet.date ? (
                <div style={{ marginLeft: "5px" }}>
                  <span
                    style={{ fontWeight: "bold" }}
                    onClick={(e) => handleOnClick(e)}
                  >
                    {tweet.user.displayName}
                  </span>
                  <span
                    style={{ color: "gray", marginLeft: "5px" }}
                    onClick={(e) => handleOnClick(e)}
                  >
                    @{tweet.userusername}
                  </span>
                  <span style={{ marginLeft: "5px" }}>
                    - {formatTimeDifference()}
                  </span>
                </div>
              ) : (
                <div>
                  <p
                    style={{
                      fontWeight: "bold",
                      margin: "0",
                      marginLeft: "10px",
                    }}
                    onClick={(e) => handleOnClick(e)}
                  >
                    {tweet.user.displayName}
                  </p>
                  <p
                    style={{ color: "gray", margin: "0", marginLeft: "10px" }}
                    onClick={(e) => handleOnClick(e)}
                  >
                    @{tweet.user.username}
                  </p>
                </div>
              )}
            </div>
            <TweetText stopPropagation={stopPropagation} text={tweet.text} />
            {tweet.s3Key && (
              <TweetMedia
                stopPropagation={stopPropagation}
                s3Key={tweet.s3Key}
              />
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
    )
  );
}
