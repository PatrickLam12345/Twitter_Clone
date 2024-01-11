import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function isAuth() {
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const location = useLocation()

  useEffect(() => {
    if (!userInfo && location.pathname != "/register") {
      navigate("/login");
    }
  }, []);

  return userInfo;
}
