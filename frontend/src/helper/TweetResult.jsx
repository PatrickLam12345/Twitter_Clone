import { useNavigate } from "react-router-dom";

export default function TweetResult({ tweet }) {
  const formatTimeDifference = () => {
    const now = new Date();
    const diffInSeconds = Math.floor((now - new Date(tweet.date)) / 1000);

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
      return new Date(tweet.date).toLocaleString();
    }
  };

  const navigate = useNavigate();
  const getTweetChain = (tweetId) => {
    navigate(`/tweet/${tweetId}`);
  };

  const retweet = (e, tweetId) => {
    e.stopPropagation();
  };

  const like = (e, tweetId) => {
    e.stopPropagation();
  };

  return (
    <div
      style={{
        boxSizing: "border-box",
        border: "1px solid #333",
        borderTop: "none",
      }}
      onClick={() => {
        getTweetChain(tweet.id);
      }}
    >
      <div style={{ padding: "10px" }}>
        <p>
          <span style={{ fontWeight: "bold" }}>{tweet.user.displayName}</span>
          <span style={{ color: "gray", marginLeft: "5px" }}>
            @{tweet.user.username}
          </span>
          <span style={{ marginLeft: "5px" }}>- {formatTimeDifference()}</span>
        </p>
        <p>{tweet.text}</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <button
          style={{ flex: 1, marginRight: "5px" }}
          onClick={() => {
            getTweetChain(tweet.id);
          }}
        >
          Button 1
        </button>
        <button
          style={{ flex: 1, marginRight: "5px" }}
          onClick={(e) => {
            retweet(e, tweet.id);
          }}
        >
          Button 2
        </button>
        <button
          style={{ flex: 1 }}
          onClick={(e) => {
            like(e, tweet.id);
          }}
        >
          Button 3
        </button>
      </div>
    </div>
  );
}
