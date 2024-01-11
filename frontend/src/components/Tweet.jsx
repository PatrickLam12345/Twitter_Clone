import { useState } from "react";
import axios from "axios";
import { Modal, Backdrop, Box, Fade } from "@mui/material";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";
import ImageIcon from "@mui/icons-material/Image";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

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

const backdropStyle = {
  zIndex: (theme) => theme.zIndex.drawer + 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
};

export default function Tweet({ open, handleClose }) {
  const userInfo = useSelector(selectUserInfo);
  const [text, setText] = useState("");
  const [rows, setRows] = useState(6);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleClearImage = () => {
    setImagePreview(null);
    setFile(null);
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = null;
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    console.log(selectedFile);
    const previewURL = URL.createObjectURL(selectedFile);
    setImagePreview(previewURL);
  };

  const handleInputChange = (e) => {
    const lines = e.target.value.split("\n");
    const newRows = Math.min(lines.length, 15);

    setText(e.target.value);
    setRows(newRows);
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
    const formData = new FormData();
    const usernames = (text.match(/@(\w+)/g) || []).map((username) =>
      username.slice(1)
    );
    const descriptionData = JSON.stringify({
      userId: userInfo.id,
      text,
      usernames,
    });
    formData.append("file", file);
    formData.append("description", descriptionData);
    try {
      const response = await axios.post(
        `http://localhost:3000/api/user/postTweet`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: window.localStorage.getItem("token"),
          },
        }
      );
      if (response.status == 201) {
        setText("");
        handleClearImage();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          style: backdropStyle,
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            ...style,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "2px solid #1d9bf0",
            borderRadius: "15px",
            padding: "16px",
          }}
        >
          <div>
            <textarea
              placeholder="What's on your mind?"
              value={text}
              onChange={handleInputChange}
              rows={8}
              style={{
                padding: "8px",
                width: "100%",
                boxSizing: "border-box",
                resize: "none",
                backgroundColor: "#000000",
                border: "none",
                outline: "none",
                overflow: "auto",
                scrollbarWidth: "none",
              }}
            />
            {imagePreview && (
              <div style={{ position: "relative" }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    position: "relative",
                    cursor: "pointer",
                    color: "white",
                  }}
                />
                <CloseIcon
                  style={{ position: "absolute", top: 20, right: 10 }}
                  onClick={handleClearImage}
                />
              </div>
            )}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex" }}>
              <div>
                <IconButton aria-label="upload" component="label">
                  <ImageIcon sx={{ color: "#1DA1F2" }} />
                  <input
                    hidden
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e)}
                  />
                </IconButton>
              </div>
            </div>
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
              Tweet
            </button>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}
