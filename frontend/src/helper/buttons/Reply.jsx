import { useNavigate } from "react-router-dom";

export default function Reply({ tweetId }) {
  const navigate = useNavigate();
  const getTweetChain = (tweetId) => {
    navigate(`/tweet/${tweetId}`);
  };
  return (
    <button
      style={{ flex: 1, marginRight: "5px" }}
      onClick={() => {
        getTweetChain(tweet.id);
      }}
    >
      Button 1
    </button>
  );
}
