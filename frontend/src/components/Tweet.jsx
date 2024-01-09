import { useState } from "react";
import axios from "axios";
import { Modal, Backdrop, Box, Fade } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";

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

export default function Tweet({ open, handleClose }) {
  const userInfo = useSelector(selectUserInfo);
  const [text, setText] = useState("");
  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setText("");
    handleClose();
    if (text.trim()) {
      handlePost();
    }
  };

  const handlePost = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/user/postTweet`,
        {
          text,
          userId: userInfo.id,
        },
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
        }
      );
      if (response.status == 201) {
        console.log("tweet posted");
      }
    } catch (error) {}
  };

  return (
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
          <form
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <input
              type="text"
              name="text"
              placeholder="What's on your mind?"
              value={text}
              onChange={handleInputChange}
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                marginTop: "16px",
                borderRadius: "20px",
                border: "2px solid #1d9bf0",
                marginBottom: "12px",
              }}
            />
            <button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              style={{
                backgroundColor: "#1d9bf0",
                color: "white",
                borderRadius: "20px",
                padding: "10px 20px",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Tweet!
            </button>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
}
