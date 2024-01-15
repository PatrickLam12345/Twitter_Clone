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
  // const [imageSrc, setImageSrc] = useState(null);
  // useEffect(() => {
  //   const getS3Image = async () => {
  //     try {
  //       const response = await axios.get(
  //         "http://localhost:3000/api/user/getS3Media",
  //         {
  //           headers: {
  //             authorization: window.localStorage.getItem("token"),
  //           },
  //           params: {
  //             s3Key: userInfo.s3Key,
  //           },
  //           responseType: "arraybuffer",
  //         }
  //       );
  //       console.log(response);
  //       const contentType = response.headers["content-type"];
  //       const blob = new Blob([response.data], { type: contentType });
  //       const imageUrl = URL.createObjectURL(blob);
  //       setImageSrc(imageUrl);
  //       console.log(imageUrl, "root");
  //       console.log(userInfo, "root")
  //     } catch (error) {
  //       console.error("Error Fetching:", error);
  //     }
  //   };

  //   getS3Image();
  // }, [userInfo]);

  return userInfo ? (
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
        {/* <img
          onClick={(e) => handleOnClick(e)}
          src={imageSrc}
          style={{ height: "50px", width: "auto" }}
          alt="S3 Image"
        /> */}
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
  ) : (
    <Outlet />
  );
}
