import RepeatIcon from "@mui/icons-material/Repeat";

export default function Retweet() {
  const retweet = (tweetId) => {};

  return (
    <div
      onClick={() => {
        retweet(tweetId);
      }}
    >
      <RepeatIcon />
    </div>
  );
}
