import { useEffect, useState, useSyncExternalStore } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import TweetText from "../helper/TweetText";
import Reply from "../helper/buttons/Reply";
import Retweet from "../helper/buttons/Retweet";
import Like from "../helper/buttons/Like";
import ReplyBox from "../helper/ReplyBox";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";
import TweetResult from "../helper/TweetResult";
import TweetMedia from "../helper/TweetMedia";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import isAuth from "../auth/isAuth";
import TweetProfile from "../helper/TweetProfile";

export default function TweetChain() {
  const userInfo = isAuth();
  const [replies, setReplies] = useState([]);
  const [tweet, setTweet] = useState(null);
  const [fetchRepliesTrigger, setFetchRepliesTrigger] = useState(false);
  const { tweetId } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
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
  }, [tweet]);

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

  const handleOnClick = (e) => {
    stopPropagation(e);
    navigate(`/${username}`);
  };

  const navigate = useNavigate();
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
          "https://twitterclonebackend2024.onrender.com/api/user/getTweetDetails",
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
        console.error("Error fetching tweet:", error);
      }
    };

    fetchTweet();
  }, [tweetId]);

  const fetchReplies = async () => {
    try {
      const response = await axios.get(
        "https://twitterclonebackend2024.onrender.com/api/user/getTweetReplies",
        {
          params: {
            id: tweetId,
            currentPage: 1,
          },
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
        }
      );
      setReplies(response.data);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching tweet replies:", error);
    }
  };

  const fetchMoreReplies = async () => {
    try {
      const response = await axios.get(
        "https://twitterclonebackend2024.onrender.com/api/user/getTweetReplies",
        {
          params: {
            id: tweetId,
            currentPage: currentPage + 1,
          },
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
        }
      );
      setReplies((prevReplies) => [...prevReplies, ...response.data]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching tweet replies:", error);
    }
  };

  useEffect(() => {
    setCurrentPage(0);
    if (tweet) {
      fetchReplies();
    }
  }, [tweet, fetchRepliesTrigger]);

  const onReplyBoxPost = () => {
    setFetchRepliesTrigger((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop <= clientHeight + 1) {
        fetchMoreReplies();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, currentPage]);

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {tweet && loadingState ? (
        <div>
          <div
            style={{
              boxSizing: "border-box",
              border: "1px solid #333",
            }}
          >
            <div
              style={{
                padding: "10px",
                marginLeft: "20px",
                marginRight: "20px",
              }}
            >
              <div style={{ display: "inline-block", marginTop: "10px" }}>
                {tweet.originalTweetId ? (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ArrowUpwardIcon
                      sx={{ marginRight: "10px" }}
                      onClick={() =>
                        navigate(`/tweet/${tweet.originalTweetId}`)
                      }
                    />
                    <p style={{ color: "gray", fontSize: "15px" }}>
                      View Original Tweet
                    </p>
                  </div>
                ) : null}
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  <div style={{ width: "50px", textAlign: "center" }}>
                    <img
                      onClick={(e) => handleOnClick(e)}
                      src={imageSrc}
                      style={{
                        height: "50px",
                        width: "auto",
                        maxWidth: "50px",
                      }}
                      alt="S3 Image"
                    />
                  </div>
                  {tweet.date ? (
                    <div style={{ marginLeft: "5px" }}>
                      <span
                        style={{ fontWeight: "bold" }}
                        onClick={(e) => handleOnClick(e)}
                      >
                        {tweet.user.ArrowUpwardIcondisplayName}
                      </span>
                      <p
                        style={{
                          fontWeight: "bold",
                          margin: "0",
                          marginLeft: "5px"
                        }}
                        onClick={(e) => handleOnClick(e)}
                      >
                        {tweet.user.displayName}
                      </p>
                      <span
                        style={{ color: "gray", marginLeft: "5px" }}
                        onClick={(e) => handleOnClick(e)}
                      >
                        @{tweet.user.username}
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
                        style={{
                          color: "gray",
                          margin: "0",
                          marginLeft: "10px",
                        }}
                        onClick={(e) => handleOnClick(e)}
                      >
                        @{tweet.user.username}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <TweetText stopPropagation={stopPropagation} text={tweet.text} />
              {tweet.s3Key && (
                <TweetMedia
                  stopPropagation={stopPropagation}
                  s3Key={tweet.s3Key}
                />
              )}
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
                <Reply userId={userInfo.id} tweetId={tweet.id} />
                <Retweet userId={userInfo.id} tweetId={tweet.id} />
                <Like userId={userInfo.id} tweetId={tweet.id} />
              </div>
              <ReplyBox
                onPost={onReplyBoxPost}
                userId={userInfo.id}
                originalTweetId={tweet.id}
                mentionedUser={tweet.user.username}
              />
            </div>
          </div>
          <div>
            {replies.map((reply) => (
              <TweetResult key={reply.id} tweet={reply} />
            ))}
          </div>
          <div style={{ height: "20vh", background: "#000000" }}></div>
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50px",
              }}
            >
              Loading...
            </div>
          )}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50px",
          }}
        >
          Loading...
        </div>
      )}
    </>
  );
}
