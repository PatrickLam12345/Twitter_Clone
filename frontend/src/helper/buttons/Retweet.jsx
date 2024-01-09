import RepeatIcon from "@mui/icons-material/Repeat";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Retweet({ userId, tweetId }) {
  const [retweeted, setRetweeted] = useState(false);
  const [retweets, setRetweets] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const getRetweetStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/hasRetweeted`,
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
        if (response.data.hasRetweeted) {
          setRetweeted(true);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getRetweetStatus();

    const getRetweetCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/getRetweetCount`,
          {
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
            params: {
              tweetId,
            },
          }
        );
        setRetweets(response.data.retweetCount);
      } catch (error) {
        console.log(error);
      }
    };

    getRetweetCount();
  }, []);

  const retweet = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/user/retweet`,
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
        setRetweeted(true);
        setRetweets((prevRetweets) => prevRetweets + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteRetweet = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/user/deleteRetweet`,
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
      setRetweeted(false);
      setRetweets((prevRetweets) => prevRetweets - 1);
    } catch (error) {
      console.log(error);
    }
  };

  return retweeted ? (
    <div
      onClick={() => {
        deleteRetweet();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: "flex", alignItems: "center" }}
    >
      <RepeatIcon sx={{ color: "#00BA7C", marginRight: "6px" }} /> {retweets}
    </div>
  ) : (
    <div
      onClick={() => {
        retweet();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ display: "flex", alignItems: "center" }}
    >
      <RepeatIcon sx={{ marginRight: "6px" }} /> {retweets}
    </div>
  );
}
