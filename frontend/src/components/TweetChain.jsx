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

export default function TweetChain() {
  const userInfo = useSelector(selectUserInfo);
  const [replies, setReplies] = useState([]);
  const [tweet, setTweet] = useState(null);
  const [fetchRepliesTrigger, setFetchRepliesTrigger] = useState(false);
  const { tweetId } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

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
        console.log(response.data, "gettings3key");
      } catch (error) {
        console.error("Error fetching tweet:", error);
      }
    };

    fetchTweet();
  }, [tweetId]);

  const fetchReplies = async () => {
    console.log(tweet);
    console.log(userInfo.id);
    console.log(tweet.id);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getTweetReplies",
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
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching tweet replies:", error);
    }
  };

  const fetchMoreReplies = async () => {
    console.log(tweet);
    console.log(userInfo.id);
    console.log(tweet.id);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getTweetReplies",
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
      console.log(response.data);
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

      if (scrollHeight - scrollTop === clientHeight) {
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
      {tweet ? (
        <div>
          <div
            style={{
              boxSizing: "border-box",
              border: "1px solid #333",
            }}
          >
            <div style={{ padding: "10px", marginLeft: "20px" }}>
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
                  style={{ color: "gray" }}
                  onClick={() => {
                    navProfile(tweet.user.username);
                  }}
                >
                  @{tweet.user.username}
                </p>
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
      ) : null}
    </>
  );
}
