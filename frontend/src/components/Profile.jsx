import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TweetResult from "../helper/TweetResult";

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [currentPage, setCurrentPage] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [results, setResults] = useState(null);
  const navigate = useNavigate();
  const [shouldDisplayNoDataMessage, setShouldDisplayNoDataMessage] =
    useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShouldDisplayNoDataMessage(true);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [results, activeTab]);

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getUserProfileByUsername",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            username,
          },
        }
      );
      setUser(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getFollowers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getFollowerCount",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
          },
        }
      );
      setFollowers(response.data.followerCount);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getFollowing = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getFollowingCount",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
          },
        }
      );
      setFollowing(response.data.followingCount);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  useEffect(() => {
    if (username) {
      getUserProfile();
    }
  }, [username]);

  useEffect(() => {
    if (user) {
      getTweets();
      getFollowers();
      getFollowing();
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop === clientHeight) {
        if (activeTab == "posts") {
          getMoreTweets();
        } else if (activeTab == "replies") {
          getMoreReplies();
        } else if (activeTab == "likes") {
          getMoreLikes();
        } else if (activeTab == "retweets") {
          getMoreRetweets();
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab, currentPage]);

  const handleTabClick = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
    if (tab == "posts") {
      setCurrentPage(0);
      getTweets();
    } else if (tab == "replies") {
      setCurrentPage(0);
      getReplies();
    } else if (tab == "likes") {
      setCurrentPage(0);
      getLikes();
    } else if (tab == "retweets") {
      setCurrentPage(0);
      getRetweets();
    }
  };

  const tabStyle = (tab) => {
    return {
      padding: "6px 25px",
      cursor: "pointer",
      borderBottom: activeTab === tab ? "3px solid #1d9bf0" : "none",
      borderRadius: "2px",
      fontWeight: activeTab === tab ? "bolder" : "normal",
      color: activeTab === tab ? "white" : "gray",
    };
  };

  const getTweets = async () => {
    console.log(user.id);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getTweetsByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: 1,
          },
        }
      );
      const tweets = response.data;
      setCurrentPage((prevPage) => prevPage + 1);
      setResults(tweets);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreTweets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getTweetsByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: currentPage + 1,
          },
        }
      );
      const tweets = response.data;
      setCurrentPage((prevPage) => prevPage + 1);
      setResults((prevResults) => ({
        ...prevResults,
        tweets: [...prevResults.tweets, ...tweets.tweets],
      }));
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getReplies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getRepliesByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: 1,
          },
        }
      );
      console.log(response.data, "getRepl");
      setCurrentPage((prevPage) => prevPage + 1);
      setResults(response.data);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreReplies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getRepliesByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: currentPage + 1,
          },
        }
      );
      const tweets = response.data;
      setCurrentPage((prevPage) => prevPage + 1);
      setResults((prevResults) => ({
        ...prevResults,
        tweets: [...prevResults.tweets, ...tweets.tweets],
      }));
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getRetweets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getRetweetsByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: 1,
          },
        }
      );
      console.log(response.data, "retweets");
      setCurrentPage((prevPage) => prevPage + 1);
      setResults(response.data);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreRetweets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getRetwetsByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: currentPage + 1,
          },
        }
      );
      setCurrentPage((prevPage) => prevPage + 1);
      setResults((prevResults) => ({
        ...prevResults,
        tweets: [...prevResults.tweets, ...response.data.tweets],
      }));
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getLikes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getLikesByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: 1,
          },
        }
      );
      console.log(response.data);
      setCurrentPage((prevPage) => prevPage + 1);
      setResults(response.data);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreLikes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getLikesByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: currentPage + 1,
          },
        }
      );
      setCurrentPage((prevPage) => prevPage + 1);
      setResults((prevResults) => ({
        ...prevResults,
        likes: [...prevResults.likes, ...response.data.likes],
      }));
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  function formatJoinedDate(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `Joined ${month} ${year}`;
  }

  return (
    <>
      {user && (
        <div>
          <div
            style={{
              width: "100%",
              backgroundColor: "#000000",
              justifyContent: "space-around",
              cursor: "pointer",
              padding: "10px",
              boxSizing: "border-box",
              border: "1px solid #333",
            }}
          >
            <div style={{ padding: "10px", marginLeft: "10px" }}>
              <div style={{ display: "inline-block" }}>
                <p style={{ fontWeight: "bold" }}>{user.displayName}</p>
                <p style={{ color: "gray" }}>@{user.username}</p>
                <p
                  style={{
                    color: "gray",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CalendarMonthIcon
                    sx={{ fontSize: "medium", marginRight: "5px" }}
                  />
                  {formatJoinedDate(user.registrationDate)}
                </p>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "10px",
                    }}
                    onClick={() => {
                      navigate(`/${user.username}/following`);
                    }}
                  >
                    <div>{following}</div>{" "}
                    <div style={{ marginLeft: "4px", color: "gray" }}>
                      Following
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "10px",
                    }}
                    onClick={() => {
                      navigate(`/${user.username}/followers`);
                    }}
                  >
                    <div>{followers}</div>{" "}
                    <div style={{ marginLeft: "4px", color: "gray" }}>
                      Followers
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <nav
              style={{
                width: "100%",
                backgroundColor: "#000000",
                display: "flex",
                justifyContent: "space-around",
                cursor: "pointer",
                padding: "10px",
                boxSizing: "border-box",
              }}
            >
              <div
                style={tabStyle("posts")}
                onClick={() => handleTabClick("posts")}
              >
                Posts
              </div>
              <div
                style={tabStyle("replies")}
                onClick={() => handleTabClick("replies")}
              >
                Replies
              </div>
              <div
                style={tabStyle("retweets")}
                onClick={() => handleTabClick("retweets")}
              >
                Retweets
              </div>
              <div
                style={tabStyle("likes")}
                onClick={() => handleTabClick("likes")}
              >
                Likes
              </div>
            </nav>
          </div>
          {results && activeTab == "posts" ? (
            results.tweets?.length > 0 ? (
              <div>
                {results.tweets.map((tweet) => (
                  <TweetResult key={tweet.id} tweet={tweet} />
                ))}
              </div>
            ) : (
              shouldDisplayNoDataMessage && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50px",
                  }}
                >
                  User has no posts...
                </div>
              )
            )
          ) : null}

          {results && activeTab == "replies" ? (
            results.tweets?.length > 0 ? (
              <div>
                {results.tweets.map((tweet) => (
                  <TweetResult key={tweet.id} tweet={tweet} />
                ))}
              </div>
            ) : (
              shouldDisplayNoDataMessage && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50px",
                  }}
                >
                  User has not replied to anything...
                </div>
              )
            )
          ) : null}

          {results && activeTab == "retweets" ? (
            results.tweets?.length > 0 ? (
              <div>
                {results.tweets.map((tweet) => (
                  <TweetResult key={tweet.id} tweet={tweet} />
                ))}
              </div>
            ) : (
              shouldDisplayNoDataMessage && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50px",
                  }}
                >
                  User has not retweeted anything...
                </div>
              )
            )
          ) : null}

          {results && activeTab == "likes" ? (
            results.likes?.length > 0 ? (
              <div>
                {results.likes.map((tweet) => (
                  <TweetResult key={tweet.tweet.id} tweet={tweet.tweet} />
                ))}
              </div>
            ) : (
              shouldDisplayNoDataMessage && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50px",
                  }}
                >
                  User has not liked anything...
                </div>
              )
            )
          ) : null}
        </div>
      )}
    </>
  );
}
