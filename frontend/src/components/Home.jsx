import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";
import axios from "axios";
import TweetResult from "../helper/TweetResult";

export default function Home() {
  const userInfo = useSelector(selectUserInfo);
  const [feed, setFeed] = useState(null);
  const [activeTab, setActiveTab] = useState("forYou");
  const [startIndex, setStartIndex] = useState(0);
  const [shouldDisplayNoDataMessage, setShouldDisplayNoDataMessage] =
    useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShouldDisplayNoDataMessage(true);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [feed, activeTab]);

  const getFollowingFeed = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getFollowingFeed",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: userInfo.id,
            startIndex: 0,
          },
        }
      );
      console.log(response.data);
      setFeed(response.data.tweets);
      setStartIndex(response.data.startIndex);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      getFollowingFeed();
    }
  }, [userInfo]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop === clientHeight) {
        if (activeTab == "forYou") {
          getMoreTweets();
        } else {
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab, startIndex]);

  const handleTabClick = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }

    if (tab == "forYou") {
    } else {
    }
  };

  const tabStyle = (tab) => ({
    padding: "6px 25px",
    cursor: "pointer",
    borderBottom: activeTab === tab ? "3px solid #1d9bf0" : "none",
    borderRadius: "2px",
    fontWeight: activeTab === tab ? "bolder" : "normal",
    color: activeTab === tab ? "white" : "gray",
  });

  return (
    <div>
      <nav
        style={{
          width: "100%",
          backgroundColor: "#000000",
          display: "flex",
          justifyContent: "space-around",
          cursor: "pointer",
          padding: "10px",
          boxSizing: "border-box",
          border: "1px solid #333",
        }}
      >
        <div
          style={tabStyle("forYou")}
          onClick={() => handleTabClick("forYou")}
        >
          For You
        </div>
        <div
          style={tabStyle("following")}
          onClick={() => handleTabClick("following")}
        >
          Following
        </div>
      </nav>
      {feed && activeTab == "following" ? (
        feed.length > 0 ? (
          <div>
            {feed.map((tweet) => (
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
              User follows no one/following has no posts
            </div>
          )
        )
      ) : null}
    </div>
  );
}
