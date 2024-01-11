import { useState } from "react";
import axios from "axios";
import ImageIcon from "@mui/icons-material/Image";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ReplyBox({ onPost, userId, originalTweetId, mentionedUser }) {
  const [text, setText] = useState("");
  const [rows, setRows] = useState(1);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    console.log(selectedFile);
    const previewURL = URL.createObjectURL(selectedFile);
    setImagePreview(previewURL);
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setFile(null);
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = null;
    }
  };

  const handleInputChange = (e) => {
    const lines = e.target.value.split("\n");
    const newRows = Math.min(lines.length, 15);

    setText(e.target.value);
    setRows(newRows);
  };

  const postReply = async () => {
    console.log(mentionedUser)
    const formData = new FormData();
    const names = (text.match(/@(\w+)/g) || []).map(username => username.slice(1))
    const usernames = names
    if (mentionedUser) {
      usernames.push(mentionedUser)
    }
    console.log(usernames)
    const descriptionData = JSON.stringify({
      userId,
      originalTweetId,
      text,
      usernames,
    });

    formData.append("file", file);
    formData.append("description", descriptionData);
    if (text.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/user/postReply`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              authorization: window.localStorage.getItem("token"),
            },
          }
        );
        if (response.status == 201) {
          onPost();
          setText("");
          handleClearImage();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <textarea
        placeholder="Post Your Reply"
        value={text}
        onChange={handleInputChange}
        rows={rows}
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
          msOverflowStyle: "none",
          "&::WebkitScrollbar": {
            width: "none !important",
            display: "none !important",
          },
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
                onChange={(e) => handleFileChange(e)}
              />
            </IconButton>
          </div>
        </div>
        <button
          variant="contained"
          color="primary"
          onClick={postReply}
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
          Reply
        </button>
      </div>
    </div>
  );
}
