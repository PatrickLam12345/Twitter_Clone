import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Register() {
  console.log("hi")
  const navigate = useNavigate();
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
        height: "100vh",
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
