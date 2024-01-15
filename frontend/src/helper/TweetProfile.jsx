import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TweetProfile({
  stopPropagation,
  displayName,
  username,
  date,
  s3Key,
}) {
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
              s3Key,
            },
            responseType: "arraybuffer",
          }
        );
        console.log(response, "pfp");
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

  const formatTimeDifference = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(date)) / 1000);

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
      return new Date(date).toLocaleString();
    }
  };

  const navigate = useNavigate();
  const handleOnClick = (e) => {
    stopPropagation(e);
    navigate(`/${username}`);
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      <div style={{ width: "50px", textAlign: "center" }}>
        <img
          onClick={(e) => handleOnClick(e)}
          src={imageSrc}
          style={{ height: "50px", width: "auto" }}
          alt="S3 Image"
        />
      </div>
      {date ? (
        <div style={{ marginLeft: "5px" }}>
          <span
            style={{ fontWeight: "bold" }}
            onClick={(e) => handleOnClick(e)}
          >
            {displayName}
          </span>
          <span
            style={{ color: "gray", marginLeft: "5px" }}
            onClick={(e) => handleOnClick(e)}
          >
            @{username}
          </span>
          <span style={{ marginLeft: "5px" }}>- {formatTimeDifference()}</span>
        </div>
      ) : (
        <div>
          <p
            style={{ fontWeight: "bold", margin: "0", marginLeft: "10px" }}
            onClick={(e) => handleOnClick(e)}
          >
            {displayName}
          </p>
          <p
            style={{ color: "gray", margin: "0", marginLeft: "10px" }}
            onClick={(e) => handleOnClick(e)}
          >
            @{username}
          </p>
        </div>
      )}
    </div>
  );
}
