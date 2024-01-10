import "./App.css";
import { useState, useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import axios from "axios";

import Root from "./routes/root";
import ErrorPage from "./routes/ErrorPage";

import Login from "./auth/Login";
import Register from "./auth/Register";
import Logout from "./auth/Logout";

import Explore from "./components/Explore";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Tweet from "./components/Tweet";
import TweetChain from "./components/TweetChain";
import Followers from "./components/Followers";
import Following from "./components/Following";

import { selectUserInfo, setUserInfo } from "./redux/userInfoSlice";
import { useDispatch, useSelector } from "react-redux";

export default function App() {
  const dispatch = useDispatch()
  const userInfo = useSelector(selectUserInfo)
  console.log(userInfo)
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <Home />,
        },
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/explore",
          element: <Explore />,
        },
        {
          path: "/:username",
          element: <Profile />,
        },
        {
          path: "/:username/followers",
          element: <Followers />,
        },
        {
          path: "/:username/following",
          element: <Following />,
        },
        {
          path: "/tweet/:tweetId",
          element: <TweetChain />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
      ],
    },
  ]);

  useEffect(() => {
    const possiblyLogin = async () => {
      const token = window.localStorage.getItem("token");
      if (token) {
        try {
          const userResponse = await axios.get(
            "http://localhost:3000/api/auth/getUserInfo",
            {
              headers: {
                authorization: token,
              },
            }
          );

          dispatch(setUserInfo(userResponse.data));
        } catch (error) {
          console.log(error);
        }
      }
    };

    possiblyLogin();
  }, []);


  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}
