import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useState } from "react";
import axios from "axios";
import { Modal, Backdrop, Box, Fade } from "@mui/material";
import ReplyBox from "../ReplyBox";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -85%)",
  width: 400,
  bgcolor: "#000000",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Reply({ userId, tweetId }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };

  return (
    <div>
      <div
        onClick={() => {
          handleOpen();
        }}
      >
        <ChatBubbleOutlineIcon />
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
          <Box sx={style}>
            <ReplyBox
              onPost={handleClose}
              userId={userId}
              originalTweetId={tweetId}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
