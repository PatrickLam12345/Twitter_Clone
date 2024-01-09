import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function UserResult({ user }) {
  const [following, setFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const navigate = useNavigate()
  const handleClick = (username) => {
    navigate(`/${username}`)
  }
  
  useEffect(() => {
    if (user.isFollowing) {
      setFollowing(true);
    }
  }, []);

  const userInfo = useSelector(selectUserInfo);
  const follow = async (followingId) => {
    const response = await axios.post(
      "http://localhost:3000/api/user/follow",
      {
        followerId: userInfo.id,
        followingId,
      },
      {
        headers: {
          authorization: window.localStorage.getItem("token"),
        },
      }
    );
    setFollowing(true);
  };

  const unfollow = async (followingId) => {
    const response = await axios.delete(
      "http://localhost:3000/api/user/unfollow",
      {
        data: {
          followerId: userInfo.id,
          followingId,
        },
        headers: {
          authorization: window.localStorage.getItem("token"),
        },
      }
    );
    setFollowing(false);
  };

  return (
    <div
      style={{
        boxSizing: "border-box",
        border: "1px solid #333",
        borderTop: "none",
      }}
      onClick={() => {handleClick(user.username)}}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <div>
          <p style={{ fontWeight: "bold" }}>{user.displayName}</p>
          <p style={{ color: "gray" }}> @{user.username}</p>
        </div>
        {userInfo.id === user.id ? null : (
          <>
            {following ? (
              <button
                variant="contained"
                color="primary"
                onClick={() => unfollow(user.id)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  backgroundColor: "#000000",
                  color: isHovered ? "red" : "white",
                  borderRadius: "20px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  border: `1px solid ${isHovered ? "red" : "white"}`,
                  cursor: "pointer",
                  fontWeight: "550",
                  width: "120px",
                }}
              >
                {isHovered ? "Unfollow" : "Following"}
              </button>
            ) : (
              <button
                variant="contained"
                color="primary"
                onClick={() => follow(user.id)}
                style={{
                  backgroundColor: "#1d9bf0",
                  color: "white",
                  borderRadius: "20px",
                  padding: "10px 20px",
                  fontSize: "16px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Follow
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
