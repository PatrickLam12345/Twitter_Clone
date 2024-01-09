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

  return (
    <div
      style={{
        boxSizing: "border-box",
        border: "1px solid #333",
        borderTop: "none",
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
    </div>
  );
}
