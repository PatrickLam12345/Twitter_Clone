import { useNavigate } from "react-router-dom";

export default function TweetText({ stopPropagation, text }) {
  const navigate = useNavigate();

  const handleClick = (e, username) => {
    stopPropagation(e);
    navigate(`/${username}`);
  };

  const renderTweetWithLinks = () => {
    const tweetTextArray = text.split(/\s|\n/);
    return tweetTextArray.map((word, index) => {
      if (word.startsWith("@")) {
        const username = word.slice(1);
        return (
          <span
            key={username} 
            style={{ color: "#1DA1F2", cursor: "pointer" }}
            onClick={(e) => handleClick(e, username)}
          >
            {word}{" "}
          </span>
        );
      } else if (word.trim() === "") {
        return index < tweetTextArray.length - 1 &&
          tweetTextArray[index + 1].trim() === "" ? null : (
          <br key={`br_${index}`} />
        );
      } else {
        return <span key={`word_${index}`}> {word} </span>;
      }
    });
  };
  return <p>{renderTweetWithLinks()}</p>;
}
