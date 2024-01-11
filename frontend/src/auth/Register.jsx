import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import isAuth from "./isAuth";
import { Modal, Backdrop, Box, Fade } from "@mui/material";

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
  height: "300px",
};

const backdropStyle = {
  zIndex: (theme) => theme.zIndex.drawer + 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
};

export default function Register() {
  const userInfo = isAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    console.log(userInfo);
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo]);

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    registerUser(formData);
  };

  const registerUser = async (formData) => {
    try {
      console.log(formData);
      const response = await axios.post(
        "http://localhost:3000/api/auth/register",
        formData
      );
      navigate("/login");
    } catch (error) {}
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "60%",
        margin: "auto",
      }}
    >
      <h1>Registration</h1>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "45%",
          gap: "10px",
        }}
      >
        <input
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          name="email"
          style={{ padding: "8px" }}
        />
        <input
          placeholder="Username"
          value={formData.username}
          onChange={handleInputChange}
          name="username"
          style={{ padding: "8px" }}
        />
        <input
          placeholder="Display Name"
          value={formData.displayName}
          onChange={handleInputChange}
          name="displayName"
          style={{ padding: "8px" }}
        />
        <input
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          name="password"
          style={{ padding: "8px" }}
        />
        <button
          type="submit"
          style={{
            padding: "8px",
            color: "white",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}
