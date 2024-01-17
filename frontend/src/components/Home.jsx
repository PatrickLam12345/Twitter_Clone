import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";
import axios from "axios";
import TweetResult from "../helper/TweetResult";
import isAuth from "../auth/isAuth";

export default function Home() {
  const userInfo = isAuth();
  const [feed, setFeed] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeTab, setActiveTab] = useState("forYou");
  const [startIndex, setStartIndex] = useState(0);
  const [shouldDisplayNoDataMessage, setShouldDisplayNoDataMessage] =
    useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      const mobileThreshold = 768;
      setIsMobile(window.innerWidth < mobileThreshold);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShouldDisplayNoDataMessage(true);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [feed, activeTab]);

  const getForYouFeed = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getForYouFeed",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            currentPage: 1,
          },
        }
      );
      setFeed(response.data.tweets);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreForYouFeed = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getForYouFeed",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            currentPage: currentPage + 1,
          },
        }
      );
      setFeed((prevFeed) => [...prevFeed, ...response.data.tweets]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

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
      setFeed(response.data.tweets);
      setStartIndex(response.data.startIndex);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreFollowingFeed = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getFollowingFeed",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: userInfo.id,
            startIndex: startIndex,
          },
        }
      );
      setFeed((prevFeed) => [...prevFeed, ...response.data.tweets]);
      setStartIndex(response.data.startIndex);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  useEffect(() => {
    if (userInfo) {
      getForYouFeed();
    }
  }, [userInfo]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop <= clientHeight + 1) {
        if (activeTab == "forYou") {
          getMoreForYouFeed();
        } else if (activeTab == "following") {
          getMoreFollowingFeed();
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab, currentPage, startIndex]);

  const handleTabClick = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }

    if (tab == "forYou") {
      setCurrentPage(0);
      setStartIndex(0);
      getForYouFeed();
    } else if (tab == "following") {
      setCurrentPage(0);
      setStartIndex(0);
      getFollowingFeed();
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

  const ref1 = useRef(null);
  const ref2 = useRef(null);

  useEffect(() => {
    if (ref1.current && ref2.current) {
      const divWidth = ref1.current.clientWidth;
      ref2.current.style.width = `${divWidth}px`;
    }
  }, []);

  return (
    <div ref={ref1}>
      <nav
        ref={ref2}
        style={{
          width: "100%",
          backgroundColor: "#000000",
          display: "flex",
          justifyContent: "space-around",
          cursor: "pointer",
          padding: "10px",
          boxSizing: "border-box",
          border: "1px solid #333",
          position: "fixed",
          top: 0,
          paddingTop: "20px",
          paddingBottom: "20px",
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
      {feed && activeTab === "forYou" ? (
        feed?.length > 100 ? (
          <div>
            <div style={{ height: isMobile ? "72px" : "52px" }}></div>
            <div>
              {feed.map((tweet) => (
                <TweetResult key={tweet.id} tweet={tweet} />
              ))}
            </div>
          </div>
        ) : (
          shouldDisplayNoDataMessage && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: isMobile ? "200px" : "150px",
              }}
            >
              No posts within last 24 hours... Be the first to tweet! (Go to explore and type user to find test users)
            </div>
          )
        )
      ) : null}
      {feed && activeTab == "following" ? (
        feed.length > 0 ? (
          <div>
            <div style={{ height: "52px" }}></div>
            <div>
              {feed.map((tweet) => (
                <TweetResult key={tweet.id} tweet={tweet} />
              ))}
            </div>
          </div>
        ) : (
          shouldDisplayNoDataMessage && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: isMobile ? "200px" : "150px",
              }}
            >
              User follows no one/following has no posts...
            </div>
          )
        )
      ) : null}
      <div style={{ height: "200px" }}></div>
    </div>
  );
}
