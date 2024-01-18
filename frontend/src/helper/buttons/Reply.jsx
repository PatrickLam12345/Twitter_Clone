import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Backdrop, Box, Fade } from "@mui/material";
import ReplyBox from "../ReplyBox";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -85%)",
  width: "90%",
  maxWidth: 400,
  bgcolor: "#000000",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Reply({ userId, tweetId }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [replies, setReplies] = useState(0);

  const handleSubmit = () => {
    setReplies((prevReplies) => prevReplies + 1);
    handleClose();
  };

  useEffect(() => {
    const getReplyCount = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/user/getReplyCount`,
          {
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
            params: {
              tweetId,
            },
          }
        );
        setReplies(response.data.replyCount);
      } catch (error) {
        console.log(error);
      }
    };

    getReplyCount();
  }, [tweetId]);

  return (
    <div>
      <div
        onClick={() => {
          handleOpen();
        }}
        style={{ display: "flex", alignItems: "center" }}
      >
        <ChatBubbleOutlineIcon sx={{ marginRight: "6px" }} /> {replies}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: { ...Backdrop } }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              ...style,
              border: "2px solid #1d9bf0",
              borderRadius: "15px",
              padding: "16px",
            }}
          >
            <ReplyBox
              onPost={handleSubmit}
              userId={userId}
              originalTweetId={tweetId}
              mentionedUser={null}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
