import { Outlet, Link } from "react-router-dom";
import TwitterIcon from "@mui/icons-material/Twitter";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Tweet from "../components/Tweet";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUserInfo } from "../redux/userInfoSlice";
import axios from "axios";

export default function Root() {
  const userInfo = useSelector(selectUserInfo);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  
  useEffect(() => {
    let scrollingTimer;

    const handleScrollStart = () => {
      setIsScrolling(true);

      clearTimeout(scrollingTimer);

      scrollingTimer = setTimeout(() => {
        setIsScrolling(false);
      }, 200);
    };

    window.addEventListener("scroll", handleScrollStart);
    window.addEventListener("wheel", handleScrollStart);

    return () => {
      window.removeEventListener("scroll", handleScrollStart);
      window.removeEventListener("wheel", handleScrollStart);

      clearTimeout(scrollingTimer);
    };
  }, []);

  const handleToggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobileThreshold = 768;
      setIsMobile(window.innerWidth < mobileThreshold);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return userInfo ? (
    isMobile ? (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
        }}
      >
        {!isScrolling && (
          <button
            style={{
              backgroundColor: "#1d9bf0",
              color: "white",
              borderRadius: "50px",
              padding: "14px 20px",
              fontSize: "16px",
              border: "none",
              cursor: "pointer",
              fontWeight: "600",
              position: "fixed",
              bottom: "20px",
              right: "20px",
              zIndex: 1000,
            }}
            onClick={handleToggleSidebar}
          >
            {sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
          </button>
        )}
        {sidebarVisible && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#000000",
              overflowX: "hidden",
              paddingTop: "80px",
              color: "white",
              overflowY: "hidden",
              padding: "20px",
              top: 0,
              left: 0,
              position: "fixed",
              zIndex: 999,
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
                onClick={handleToggleSidebar}
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
                onClick={handleToggleSidebar}
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
                  marginLeft: "",
                }}
                onClick={handleToggleSidebar}
                to="/explore"
              >
                <SearchIcon fontSize="large" /> Explore
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
                onClick={handleToggleSidebar}
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
        )}
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
    ) : (
      <div
        style={{
          display: "flex",
          height: "100%",
          maxWidth: "1100px",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <div
          style={{
            width: "200px",
            height: "100%",
            backgroundColor: "#000000",
            overflowX: "hidden",
            paddingTop: "80px",
            marginTop: "20px",
            color: "white",
            overflowY: "hidden",
            padding: "20px",
            position: "fixed",
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
                marginLeft: "",
              }}
              to="/explore"
            >
              <SearchIcon fontSize="large" /> Explore
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
            marginLeft: "240px",
            padding: "20px",
          }}
        >
          <Outlet />
        </div>
      </div>
    )
  ) : (
    <Outlet />
  );
}
