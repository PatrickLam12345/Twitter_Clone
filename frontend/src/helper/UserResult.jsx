import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function UserResult({ stopPropagation, user }) {
  const [following, setFollowing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const navigate = useNavigate();
  const navProfile = (username) => {
    navigate(`/${username}`);
  };

  useEffect(() => {
    if (user.isFollowing) {
      setFollowing(true);
    }
  }, []);

  const [imageSrc, setImageSrc] = useState(null);
  useEffect(() => {
    const getS3Image = async () => {
      try {
        const response = await axios.get(
          "https://twitterclone2024.onrender.com/api/user/getS3Media",
          {
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
            params: {
              s3Key: user.s3Key,
            },
            responseType: "arraybuffer",
          }
        );
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error Fetching:", error);
      }
    };

    getS3Image();
  }, []);

  const userInfo = useSelector(selectUserInfo);
  const follow = async (e, followingId) => {
    stopPropagation(e);
    const response = await axios.post(
      "https://twitterclone2024.onrender.com/api/user/follow",
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

  const unfollow = async (e, followingId) => {
    stopPropagation(e);
    const response = await axios.delete(
      "https://twitterclone2024.onrender.com/api/user/unfollow",
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
      onClick={() => {
        navProfile(user.username);
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <img src={imageSrc} style={{ maxHeight: "175px" }} />
        <div style={{ marginLeft: "20px" }}>
          <p style={{ fontWeight: "bold", margin: "4px", marginBottom: "10px"}}>{user.displayName}</p>
          <p style={{ color: "gray", margin: "4px", marginTop: "10px"}}> @{user.username}</p>
        </div>
        {userInfo.id === user.id ? null : (
          <div style={{ marginLeft: "auto" }}>
            {following ? (
              <button
                variant="contained"
                color="primary"
                onClick={(e) => unfollow(e, user.id)}
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
                onClick={(e) => follow(e, user.id)}
                style={{
                  backgroundColor: "#1d9bf0",
                  color: "white",
                  borderRadius: "20px",
                  padding: "10px 20px",
                  fontSize: "14px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "550",
                  width: "120px",
                }}
              >
                Follow
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
