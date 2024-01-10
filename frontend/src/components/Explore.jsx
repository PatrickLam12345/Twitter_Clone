import axios from "axios";
import { useState, useEffect } from "react";
import TweetResult from "../helper/TweetResult";
import UserResult from "../helper/UserResult";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";

export default function Explore() {
  const userInfo = useSelector(selectUserInfo);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("Latest");
  const [searchResults, setSearchResults] = useState(null);

  const handleTabClick = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }

    if (tab == "People") {
      setSearchResults(null);
      setCurrentPage(0);
      getUsers();
    } else {
      setSearchResults(null);
      setCurrentPage(0);
      getTweets();
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

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchQuery.trim()) {
        setCurrentPage(0);
        if (activeTab == "Latest") {
          getTweets();
        } else {
          getUsers();
        }
      }
    }
  };

  const stopPropagationHandler = (e) => {
    e.stopPropagation();
  };

  const getTweets = async () => {
    try {
      console.log(searchQuery);
      console.log(currentPage);
      const response = await axios.get(
        "http://localhost:3000/api/user/getMoreTweets",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            searchQuery,
            currentPage: 1,
          },
        }
      );
      const tweets = response.data;
      console.log(tweets);
      setCurrentPage((prevPage) => prevPage + 1);
      setSearchResults(tweets);
      setHasSearched(true);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreTweets = async () => {
    try {
      console.log(searchQuery);
      const response = await axios.get(
        "http://localhost:3000/api/user/getMoreTweets",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            searchQuery,
            currentPage: currentPage + 1,
          },
        }
      );
      const tweets = response.data;
      console.log(tweets);
      setCurrentPage((prevPage) => prevPage + 1);
      setSearchResults((prevResults) => [...prevResults, ...tweets]);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getUsers = async () => {
    try {
      console.log(searchQuery);
      console.log(currentPage);
      console.log(userInfo.id, "id");
      const response = await axios.get(
        "http://localhost:3000/api/user/getMoreUsers",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            searchQuery,
            currentPage: 1,
            userId: Number(userInfo.id),
          },
        }
      );
      const users = response.data;
      console.log(users);
      setCurrentPage((prevPage) => prevPage + 1);
      setSearchResults(users);
      setHasSearched(true);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreUsers = async () => {
    try {
      console.log(searchQuery);
      const response = await axios.get(
        "http://localhost:3000/api/user/getMoreUsers",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            searchQuery,
            currentPage: currentPage + 1,
            userId: userInfo.id,
          },
        }
      );
      const users = response.data;
      console.log(users);
      setCurrentPage((prevPage) => prevPage + 1);
      setSearchResults((prevResults) => [...prevResults, ...users]);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop === clientHeight) {
        if (activeTab == "Latest") {
          getMoreTweets();
        } else {
          getMoreUsers();
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading, searchQuery, currentPage]);

  return (
    <div>
      <input
        placeholder="Search"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
        style={{ padding: "8px", width: "100%", boxSizing: "border-box" }}
      />
      {hasSearched && (
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
            style={tabStyle("Latest")}
            onClick={() => handleTabClick("Latest")}
          >
            Latest
          </div>
          <div
            style={tabStyle("People")}
            onClick={() => handleTabClick("People")}
          >
            People
          </div>
        </nav>
      )}
      {searchResults && activeTab == "Latest" ? (
        searchResults.length > 0 ? (
          <div>
            {searchResults.map((result) => (
              <TweetResult key={result.id} tweet={result} />
            ))}
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
            No tweets found
          </div>
        )
      ) : null}
      {searchResults && activeTab == "People" ? (
        searchResults.length > 0 ? (
          <div>
            {searchResults.map((result) => (
              <UserResult
                key={result.id}
                stopPropagation={stopPropagationHandler}
                user={result}
              />
            ))}
          </div>
        ) : (
          <div>No Users found</div>
        )
      ) : null}
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
  );
}
