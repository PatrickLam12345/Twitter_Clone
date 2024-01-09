import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
export default function ReplyAsPost() {
  const replyAsPost = (tweetId) => {};

  return (
    <div
      onClick={() => {
        replyAsPost(tweetId);
      }}
    >
      <ChatBubbleOutlineIcon />
    </div>
  );
}
