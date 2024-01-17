import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserResult from "../helper/UserResult";
import axios from "axios";
import isAuth from "../auth/isAuth";

export default function Followers() {
  const userInfo = isAuth()
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [followers, setFollowers] = useState(null);

  const getUserProfile = async () => {
    try {
      const response = await axios.get(
        "https://twitterclonebackend2024.onrender.com/api/user/getUserProfileByUsername",
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
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  useEffect(() => {
    if (username) {
      getUserProfile();
    }
  }, [username]);

  const getFollowers = async () => {

    try {
      const response = await axios.get(
        "https://twitterclonebackend2024.onrender.com/api/user/getFollowers",
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
      setFollowers(response.data);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreFollowers = async () => {
    try {
      const response = await axios.get(
        "https://twitterclonebackend2024.onrender.com/api/user/getFollowers",
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
      setFollowers((prevResults) => [...prevResults, ...response.data]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getFollowers();
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop === clientHeight) {
        getMoreFollowers();
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [currentPage]);

  const stopPropagationHandler = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {user && followers && followers.length > 0 && (
        <div
          style={{
            boxSizing: "border-box",
            border: "1px solid #333",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "none",
          }}
        >
          {followers.map((result) => (
            <UserResult
              key={result.id}
              stopPropagation={stopPropagationHandler}
              user={result.followingUser}
            />
          ))}
        </div>
      )}
    </>
  );
}
