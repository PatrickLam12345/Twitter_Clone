import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Backdrop, Box, Fade } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserInfo } from "../redux/userInfoSlice";
import isAuth from "./isAuth";
import twitterLogo from "../images/twitterLogo.png";

const backdropStyle = {
  zIndex: (theme) => theme.zIndex.drawer + 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
};

const inputStyle = {
  padding: "8px",
  border: "1px solid #1d9bf0",
  borderRadius: "4px",
  marginBottom: "10px",
  backgroundColor: "#000000",
  color: "white",
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const userInfo = isAuth();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -85%)",
    bgcolor: "#000000",
    border: "2px solid #1d9bf0",
    boxShadow: 24,
    p: 4,
    height: "325px",
    width: "300px",
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo]);

  const handleOpenLogin = () => {
    setOpenLogin(true);
  };

  const handleCloseLogin = () => {
    setFormLogin({
      email: "",
      password: "",
    });
    setOpenLogin(false);
  };

  const handleOpenRegister = () => {
    setOpenRegister(true);
  };

  const handleCloseRegister = () => {
    setOpenRegister(false);
  };

  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });

  const [formRegister, setFormRegister] = useState({
    email: "",
    username: "",
    displayName: "",
    password: "",
  });

  const handleLoginInputChange = (event) => {
    const { name, value } = event.target;
    setFormLogin({
      ...formLogin,
      [name]: value,
    });
  };

  const handleRegisterInputChange = (event) => {
    const { name, value } = event.target;
    setFormRegister({
      ...formRegister,
      [name]: value,
    });
  };

  const onLoginSubmit = (e) => {
    e.preventDefault();

    loginUser(formLogin);
  };

  const onRegisterSubmit = (e) => {
    e.preventDefault();

    registerUser(formRegister);
  };

  const loginUser = async (formLogin) => {
    try {
      const response = await axios.post(
        "https://twitterclonebackend2024.onrender.com/api/auth/login",
        formLogin
      );

      const token = response.data;

      window.localStorage.setItem("token", token);

      const userInfoResponse = await axios.get(
        "https://twitterclonebackend2024.onrender.com/api/auth/getUserInfo",
        {
          headers: {
            authorization: token,
          },
        }
      );
      userInfoResponse.data;
      dispatch(setUserInfo(userInfoResponse.data));
    } catch (error) {
      error;
    }
  };

  const handleTestLogin = async () => {
    try {
      const response = await axios.post(
        "https://twitterclonebackend2024.onrender.com/api/auth/login",
        {
          email: "testUsertestUsertestUser",
          password: "testUsertestUsertestUser",
        }
      );

      const token = response.data;

      window.localStorage.setItem("token", token);

      const userInfoResponse = await axios.get(
        "https://twitterclonebackend2024.onrender.com/api/auth/getUserInfo",
        {
          headers: {
            authorization: token,
          },
        }
      );
      userInfoResponse.data;
      dispatch(setUserInfo(userInfoResponse.data));
    } catch (error) {
      error;
    }
  };

  const registerUser = async (formRegister) => {
    try {
      const response = await axios.post(
        "https://twitterclonebackend2024.onrender.com/api/auth/register",
        formRegister
      );
      handleCloseRegister();
      handleOpenLogin();
    } catch (error) {}
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
      }}
    >
      <img
        src={twitterLogo}
        alt="Twitter Logo"
        style={{ width: "300px", height: "auto", marginBottom: "50px" }}
      />
      <button
        variant="contained"
        color="primary"
        onClick={handleOpenLogin}
        style={{
          backgroundColor: "black",
          color: "#1d9bf0",
          borderRadius: "20px",
          padding: "10px 10px",
          width: "200px",
          fontSize: "16px",
          border: "1px solid #1d9bf0",
          cursor: "pointer",
          fontWeight: "500",
          marginBottom: "25px",
        }}
      >
        Login
      </button>
      <button
        onClick={handleOpenRegister}
        style={{
          backgroundColor: "black",
          color: "#1d9bf0",
          borderRadius: "20px",
          padding: "10px 10px",
          width: "200px",
          fontSize: "16px",
          border: "1px solid #1d9bf0",
          cursor: "pointer",
          fontWeight: "500",
          marginBottom: "25px",
        }}
      >
        Register
      </button>
      <button
        onClick={handleTestLogin}
        style={{
          backgroundColor: "black",
          color: "#1d9bf0",
          borderRadius: "20px",
          padding: "10px 10px",
          width: "200px",
          fontSize: "16px",
          border: "1px solid #1d9bf0",
          cursor: "pointer",
          fontWeight: "500",
          marginBottom: "25px",
        }}
      >
        Login as Test User
      </button>
      <Modal
        open={openLogin}
        onClose={handleCloseLogin}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            style: backdropStyle,
            timeout: 500,
          },
        }}
      >
        <Fade in={openLogin}>
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h1 style={{ marginTop: "10px" }}>Login</h1>
              <form
                onSubmit={onLoginSubmit}
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
                  value={formLogin.email}
                  onChange={handleLoginInputChange}
                  name="email"
                  style={inputStyle}
                />
                <input
                  placeholder="Password"
                  value={formLogin.password}
                  onChange={handleLoginInputChange}
                  name="password"
                  style={inputStyle}
                />
                <button
                  type="submit"
                  style={{
                    padding: "8px",
                    border: "1px solid #1d9bf0",
                    borderRadius: "4px",
                    marginBottom: "10px",
                    backgroundColor: "#000000",
                    color: "white",
                    width: "180px",
                    marginTop: "100px",
                  }}
                >
                  Login
                </button>
              </form>
            </div>
          </Box>
        </Fade>
      </Modal>
      <Modal
        open={openRegister}
        onClose={handleCloseRegister}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            style: backdropStyle,
            timeout: 500,
          },
        }}
      >
        <Fade in={openRegister}>
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h1 style={{ marginTop: "10px" }}>Register</h1>
              <form
                onSubmit={onRegisterSubmit}
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
                  value={formRegister.email}
                  onChange={handleRegisterInputChange}
                  name="email"
                  style={inputStyle}
                />
                <input
                  placeholder="Username"
                  value={formRegister.username}
                  onChange={handleRegisterInputChange}
                  name="username"
                  style={inputStyle}
                />
                <input
                  placeholder="Display Name"
                  value={formRegister.displayName}
                  onChange={handleRegisterInputChange}
                  name="displayName"
                  style={inputStyle}
                />
                <input
                  placeholder="Password"
                  value={formRegister.password}
                  onChange={handleRegisterInputChange}
                  name="password"
                  style={inputStyle}
                />
                <button
                  type="submit"
                  style={{
                    padding: "8px",
                    border: "1px solid #1d9bf0",
                    borderRadius: "4px",
                    marginBottom: "10px",
                    backgroundColor: "#000000",
                    color: "white",
                    width: "180px",
                  }}
                >
                  Register
                </button>
              </form>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
