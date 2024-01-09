import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUserInfo, setUserInfo } from "../redux/userInfoSlice";

export default function Login() {
  const userInfo = useSelector(selectUserInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    loginUser(formData);
  };

  const loginUser = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        formData
      );

      const token = response.data;

      window.localStorage.setItem("token", token);

      const userInfoResponse = await axios.get("http://localhost:3000/api/auth/getUserInfo", {
        headers: {
          authorization: token,
        },
      });
      dispatch(setUserInfo(userInfoResponse.data));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>Login</h1>
      <form
        onSubmit={onSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          height: "100%",
          gap: "10px",
        }}
      >
        <input
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          name="email"
        />
        <input
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          name="password"
        />
        <button type="submit">Login</button>
      </form>
      <div>Don't have an account?</div>
      <Link to="/register">
        <button>Register</button>
      </Link>
    </div>
  );
}
