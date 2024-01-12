import { useNavigate } from "react-router-dom";

export default function TweetProfile({
  stopPropagation,
  displayName,
  username,
  date
}) {
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
    <div>
      <span style={{ fontWeight: "bold" }} onClick={(e) => handleOnClick(e)}>
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
  );
}
