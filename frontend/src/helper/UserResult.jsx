export default function UserResult({ user }) {
  const handleSubmit = async () => {
    const response = await axios.post(
        "http://localhost:3000/api/user/follow",
      );
  };
  return (
    <div
      style={{
        boxSizing: "border-box",
        border: "1px solid #333",
        borderTop: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px",
        }}
      >
        <div>
          <p style={{ fontWeight: "bold" }}>{user.displayName}</p>
          <p style={{ color: "gray" }}> @{user.username}</p>
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
          Follow
        </button>
      </div>
    </div>
  );
}
