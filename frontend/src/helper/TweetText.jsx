import { useNavigate } from "react-router-dom";

export default function TweetText({ stopPropagation, text }) {
  const navigate = useNavigate();

  const handleClick = (e, username) => {
    stopPropagation(e);
    navigate(`/${username}`);
  };

  const renderTweetWithLinks = () => {
    const tweetTextArray = text.split(" ");

    return tweetTextArray.map((word, index) => {
      if (word.startsWith("@")) {
        const username = word.slice(1);
        return (
          <span
            key={index}
            style={{ color: "#1DA1F2", cursor: "pointer" }}
            onClick={(e) => handleClick(e, username)}
          >
            {word}{" "}
          </span>
        );
      } else {
        return <span key={index}>{word} </span>;
      }
    });
  };
  return <p>{renderTweetWithLinks()}</p>;
}
