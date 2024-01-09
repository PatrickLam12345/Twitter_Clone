import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
export default function Like() {
  const like = (tweetId) => {};

  return (
    <div
      onClick={() => {
        like(tweetId);
      }}
    >
      <FavoriteBorderIcon />
    </div>
  );
}
