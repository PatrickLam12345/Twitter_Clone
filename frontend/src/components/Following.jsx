import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserResult from "../helper/UserResult";
import axios from "axios";
import isAuth from "../auth/isAuth";

export default function Following() {
  const userInfo = isAuth()
  const [user, setUser] = useState(null);
  const { username } = useParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [following, setFollowing] = useState(null);

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
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  useEffect(() => {
    if (username) {
      getUserProfile();
    }
  }, [username]);

  const getFollowing = async () => {
    console.log(user.id);

    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getFollowing",
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
      setFollowing(response.data);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreFollowing = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getFollowing",
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
      setFollowing((prevResults) => [...prevResults, ...response.data]);
      setCurrentPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getFollowing();
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop === clientHeight) {
        getMoreFollowing();
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
      {user && following && following.length > 0 && (
        <div
          style={{
            boxSizing: "border-box",
            border: "1px solid #333",
            borderLeft: "none",
            borderRight: "none",
            borderBottom: "none"
          }}
        >
          {following.map((result) => (
            <UserResult
              key={result.followingUser.id}
              stopPropagation={stopPropagationHandler}
              user={result.followingUser}
            />
          ))}
        </div>
      )}
    </>
  );
}
