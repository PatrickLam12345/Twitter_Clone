import { Outlet, Link } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Tweet from "../components/Tweet";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";
import Register from "../auth/Register";

export default function Root() {
  const userInfo = useSelector(selectUserInfo);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return userInfo ? (
    <div
      style={{
        display: "flex",
        height: "100%",
        maxWidth: "1300px",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div
        style={{
          minWidth: "10%",
          height: "100%",
          backgroundColor: "#000000",
          overflowX: "hidden",
          paddingTop: "60px",
          color: "white",
          overflowY: "hidden",
          padding: "20px",
        }}
      >
        <div>
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              paddingBottom: "20px",
            }}
            to="/home"
          >
            <TwitterIcon fontSize="large" />
          </Link>
        </div>
        <div>
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              paddingBottom: "20px",
              gap: "15px",
            }}
            to="/home"
          >
            <HomeIcon fontSize="large" /> Home
          </Link>
        </div>
        <div>
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              paddingBottom: "20px",
              gap: "15px",
            }}
            to="/explore"
          >
            <SearchIcon fontSize="large" /> Explore
          </Link>
        </div>
        {/* <div>
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              paddingBottom: "20px",
              gap: "15px",
            }}
            to="/notifications"
          >
            <NotificationsNoneIcon fontSize="large" /> Notifications
          </Link>
        </div>
        <div>
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              paddingBottom: "20px",
              gap: "15px",
            }}
            to="/messages"
          >
            <MailOutlineIcon fontSize="large" /> Messages
          </Link>
        </div> */}
        <div>
          <Link
            style={{
              textDecoration: "none",
              color: "white",
              display: "flex",
              alignItems: "center",
              paddingBottom: "20px",
              gap: "15px",
            }}
            to={`/${userInfo.username}`}
          >
            <PersonOutlineIcon fontSize="large" /> Profile
          </Link>
        </div>
        <div>
          <button
            style={{
              backgroundColor: "#1d9bf0",
              color: "white",
              borderRadius: "50px",
              padding: "14px 80px",
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              font: "10px",
            }}
            onClick={handleOpen}
          >
            Post
          </button>
          <Tweet open={open} handleClose={handleClose} />
        </div>
      </div>
      <div
        style={{
          flex: 1,
          height: "100%",
          overflowX: "hidden",
        }}
      >
        <Outlet />
      </div>
    </div>
  ) : <Outlet />;
}
