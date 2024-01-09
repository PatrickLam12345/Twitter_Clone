import { useState } from "react";
import axios from "axios";

export default function ReplyBox({ onPost, userId, originalTweetId }) {
  const [text, setText] = useState("");
  const [rows, setRows] = useState(1);

  const handleInputChange = (e) => {
    const lines = e.target.value.split("\n");
    const newRows = Math.min(lines.length, 15);

    setText(e.target.value);
    setRows(newRows);
  };

  const postReply = async () => {
    if (text.trim()) {
      try {
        const response = await axios.post(
          `http://localhost:3000/api/user/postReply`,
          {
            userId,
            originalTweetId,
            text,
          },
          {
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
          }
        );
        if (response.status == 201) {
          onPost()
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
        alignItems: "flex-end",
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
          overflow: "hidden",
        }}
      />
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
  );
}
