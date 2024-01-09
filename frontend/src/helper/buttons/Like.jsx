import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../../redux/userInfoSlice";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { red } from "@mui/material/colors";

export default function Like({ userId, tweetId, likes }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    console.log(likes);
    console.log(likeCount);
    console.log(userId, "WTF");
    console.log(tweetId);
    const getLikedStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/hasLiked`,
          {
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
            params: {
              userId,
              tweetId,
            },
          }
        );
        if (response.data.hasLiked) {
          setLiked(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getLikedStatus();

    const getLikeCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/getLikeCount`,
          {
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
            params: {
              tweetId,
            },
          }
        );
        setLikeCount(response.data.likeCount);
      } catch (error) {
        console.log(error);
      }
    };

    getLikeCount();
  }, []);

  const like = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/user/like`,
        {
          userId,
          tweetId,
        },
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
        }
      );
      if (response.status == 201) {
        setLiked(true);
        setLikeCount((prevLikes) => prevLikes + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const dislike = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/user/dislike`,
        {
          data: {
            userId,
            tweetId,
          },
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
        }
      );
      setLiked(false);
      setLikeCount((prevLikes) => prevLikes - 1);
    } catch (error) {
      console.log(error);
    }
  };

  return liked ? (
    <div
      onClick={() => {
        dislike();
      }}
      style={{ display: "flex", alignItems: "center" }}
    >
      <FavoriteIcon sx={{ color: red[500], marginRight: "6px" }} /> {likeCount}
    </div>
  ) : (
    <div
      onClick={() => {
        like();
      }}
      style={{ display: "flex", alignItems: "center" }}
    >
      <FavoriteBorderIcon sx={{ marginRight: "6px" }} /> {likeCount}
    </div>
  );
}
