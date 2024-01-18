import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import TweetResult from "../helper/TweetResult";
import isAuth from "../auth/isAuth";
import { Modal, Backdrop, Box, Fade, IconButton } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";

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
};
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

export default function Profile() {
  const userInfo = isAuth();
  const { username } = useParams();
  const [open, setOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [currentPage, setCurrentPage] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [results, setResults] = useState(null);
  const [newDisplayName, setNewDisplayName] = useState("");
  const navigate = useNavigate();
  const [shouldDisplayNoDataMessage, setShouldDisplayNoDataMessage] =
    useState(false);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowHovered, setIsFollowHovered] = useState(false);
  const [loadingState, setLoadingState] = useState(false);
  const [loadingTweets, setLoadingTweets] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reloadOnEditProfile, setReloadOnEditProfile] = useState(false);
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

  const handleMouseEnter = () => {
    setIsFollowHovered(true);
  };

  const handleMouseLeave = () => {
    setIsFollowHovered(false);
  };

  const handleClearImage = () => {
    setImagePreview(null);
    setFile(null);
    const fileInput = document.getElementById("fileInput");
    if (fileInput) {
      fileInput.value = null;
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    const previewURL = URL.createObjectURL(selectedFile);
    setImagePreview(previewURL);
  };

  useEffect(() => {
    setLoadingTweets(true);
    setShouldDisplayNoDataMessage(false);

    const timeoutId = setTimeout(() => {
      setShouldDisplayNoDataMessage(true);
    }, 0);
    const loadingTimeoutId = setTimeout(() => {
      setLoadingTweets(false);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(loadingTimeoutId);
    };
  }, [activeTab]);

  const getUserProfile = async () => {
    if (username && userInfo) {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/getUserProfileAndIsFollowingByUsername",
          {
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
            params: {
              username,
              userId: userInfo.id,
            },
          }
        );
        setUser(response.data);
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error Fetching:", error);
      }
    }
  };

  const getS3Image = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getS3Media",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            s3Key: user.s3Key,
          },
          responseType: "arraybuffer",
        }
      );
      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const imageUrl = URL.createObjectURL(blob);
      setImageSrc(imageUrl);
      setLoadingState(true);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const follow = async () => {
    const response = await axios.post(
      "http://localhost:3000/api/user/follow",
      {
        followerId: userInfo.id,
        followingId: user.id,
      },
      {
        headers: {
          authorization: window.localStorage.getItem("token"),
        },
      }
    );
    setIsFollowing(true);
  };

  const unfollow = async () => {
    const response = await axios.delete(
      "http://localhost:3000/api/user/unfollow",
      {
        data: {
          followerId: userInfo.id,
          followingId: user.id,
        },
        headers: {
          authorization: window.localStorage.getItem("token"),
        },
      }
    );
    setIsFollowing(false);
  };

  const getFollowers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getFollowerCount",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
          },
        }
      );
      setFollowers(response.data.followerCount);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getFollowing = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getFollowingCount",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
          },
        }
      );
      setFollowing(response.data.followingCount);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  useEffect(() => {
    if (username) {
      getUserProfile();
    }
  }, [username, userInfo]);

  useEffect(() => {
    if (user) {
      getTweets();
      getFollowers();
      getFollowing();
      getS3Image();
    }
  }, [user]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;

      if (scrollHeight - scrollTop <= clientHeight + 1) {
        if (activeTab == "posts") {
          getMoreTweets();
        } else if (activeTab == "replies") {
          getMoreReplies();
        } else if (activeTab == "likes") {
          getMoreLikes();
        } else if (activeTab == "retweets") {
          getMoreRetweets();
        } else if (activeTab == "mentions") {
          getMoreMentions();
        }
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeTab, currentPage, userInfo?.id]);

  const handleTabClick = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
      setLoadingState(true);
      setShouldDisplayNoDataMessage(false);
    }
    if (tab == "posts") {
      setCurrentPage(0);
      getTweets();
    } else if (tab == "replies") {
      setCurrentPage(0);
      getReplies();
    } else if (tab == "likes") {
      setCurrentPage(0);
      getLikes();
    } else if (tab == "retweets") {
      setCurrentPage(0);
      getRetweets();
    } else if (tab == "mentions") {
      setCurrentPage(0);
      getMentions();
    }
  };

  const tabStyle = (tab) => {
    return {
      padding: "6px 25px",
      cursor: "pointer",
      borderBottom: activeTab === tab ? "3px solid #1d9bf0" : "none",
      borderRadius: "2px",
      fontWeight: activeTab === tab ? "bolder" : "normal",
      color: activeTab === tab ? "white" : "gray",
    };
  };

  const getTweets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getTweetsByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: 1,
          },
        }
      );
      const tweets = response.data;
      setCurrentPage((prevPage) => prevPage + 1);
      setResults(tweets);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreTweets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getTweetsByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: currentPage + 1,
          },
        }
      );
      const tweets = response.data;
      setCurrentPage((prevPage) => prevPage + 1);
      setResults((prevResults) => ({
        ...prevResults,
        tweets: [...prevResults.tweets, ...tweets.tweets],
      }));
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getReplies = async () => {
    setLoadingTweets(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getRepliesByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: 1,
          },
        }
      );
      setCurrentPage((prevPage) => prevPage + 1);
      setResults(response.data);
      setLoadingTweets(false);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreReplies = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getRepliesByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: currentPage + 1,
          },
        }
      );
      const tweets = response.data;
      setCurrentPage((prevPage) => prevPage + 1);
      setResults((prevResults) => ({
        ...prevResults,
        tweets: [...prevResults.tweets, ...tweets.tweets],
      }));
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getRetweets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getRetweetsByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: 1,
          },
        }
      );
      setCurrentPage((prevPage) => prevPage + 1);
      setResults(response.data.retweets);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreRetweets = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getRetweetsByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: currentPage + 1,
          },
        }
      );
      setCurrentPage((prevPage) => prevPage + 1);
      setResults((prevResults) => ({
        ...prevResults,
        ...response.data.retweets,
      }));
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getLikes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getLikesByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: 1,
          },
        }
      );
      setCurrentPage((prevPage) => prevPage + 1);
      setResults(response.data);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreLikes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getLikesByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: currentPage + 1,
          },
        }
      );
      setCurrentPage((prevPage) => prevPage + 1);
      setResults((prevResults) => ({
        ...prevResults,
        likes: [...prevResults.likes, ...response.data.likes],
      }));
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMentions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getMentionsByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: 1,
          },
        }
      );
      setCurrentPage((prevPage) => prevPage + 1);
      setResults(response.data);
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  const getMoreMentions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/getMentionsByUser",
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
          params: {
            userId: user.id,
            currentPage: currentPage + 1,
          },
        }
      );
      setCurrentPage((prevPage) => prevPage + 1);
      setResults((prevResults) => ({
        ...prevResults,
        tweets: [...prevResults.tweets, ...response.data.tweets],
      }));
    } catch (error) {
      console.error("Error Fetching:", error);
    }
  };

  function formatJoinedDate(dateString) {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    return `Joined ${month} ${year}`;
  }

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {}, [reloadOnEditProfile]);

  const editProfile = async () => {
    const formData = new FormData();
    const descriptionData = JSON.stringify({
      displayName: newDisplayName,
      id: userInfo.id,
    });
    formData.append("file", file);
    formData.append("description", descriptionData);
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/user/editUserProfile",
        formData,
        {
          headers: {
            authorization: window.localStorage.getItem("token"),
          },
        }
      );
      if (response.status == 200) {
        setImagePreview(null);
        setFile(null);
        setNewDisplayName("");
        setReloadOnEditProfile(!reloadOnEditProfile);
        navigate(`/`);
      }
    } catch (error) {
      console.error("Error Updating Profile:", error);
    }
  };

  return (
    <>
      {user && imageSrc && loadingState ? (
        <div>
          <div
            style={{
              width: "100%",
              backgroundColor: "#000000",
              justifyContent: "space-around",
              cursor: "pointer",
              padding: "10px",
              boxSizing: "border-box",
              border: "1px solid #333",
            }}
          >
            <div style={{ padding: "10px", marginLeft: "10px" }}>
              <div style={{ display: "inline-block", width: "100%" }}>
                <div style={{ display: "flex" }}>
                  <img
                    src={imageSrc}
                    style={{
                      height: "150px",
                      maxWidth: "150px",
                      marginRight: "auto",
                      marginBottom: "8px",
                    }}
                  />

                  {userInfo.username === username ? (
                    <div>
                      <button
                        style={{
                          backgroundColor: "#000000",
                          color: "white",
                          borderRadius: "20px",
                          padding: "0px",
                          fontSize: "14px",
                          border: "1px solid white",
                          cursor: "pointer",
                          fontWeight: "550",
                          width: "115px",
                          height: "30px",
                          marginRight: "20px",
                        }}
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                        Edit Profile
                      </button>
                      <Modal
                        open={open}
                        onClose={handleClose}
                        closeAfterTransition
                        slots={{ backdrop: Backdrop }}
                        slotProps={{
                          backdrop: {
                            style: backdropStyle,
                            timeout: 500,
                          },
                        }}
                      >
                        <Fade in={open}>
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
                              <h3 style={{ marginTop: "10px" }}>
                                Edit Display Name
                              </h3>
                              <form
                                onSubmit={(e) => e.preventDefault()}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  height: "100%",
                                  gap: "10px",
                                }}
                              >
                                <input
                                  placeholder="Display Name"
                                  value={newDisplayName}
                                  onChange={(e) =>
                                    setNewDisplayName(e.target.value)
                                  }
                                  name="email"
                                  style={inputStyle}
                                />
                                <h3 style={{ margin: "0px" }}>
                                  Edit Profile Picture
                                </h3>
                                {imagePreview && (
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                    }}
                                  >
                                    <img
                                      src={imagePreview}
                                      alt="Preview"
                                      style={{
                                        maxHeight: "175px",
                                        cursor: "pointer",
                                        color: "white",
                                      }}
                                    />
                                    <CloseIcon
                                      style={{
                                        cursor: "pointer",
                                        color: "white",
                                        marginLeft: "5px",
                                      }}
                                      onClick={handleClearImage}
                                    />
                                  </div>
                                )}
                                <div>
                                  <IconButton
                                    aria-label="upload"
                                    component="label"
                                  >
                                    <ImageIcon sx={{ color: "#1DA1F2" }} />
                                    <input
                                      hidden
                                      type="file"
                                      id="fileInput"
                                      accept="image/*"
                                      onChange={(e) => handleFileChange(e)}
                                    />
                                  </IconButton>
                                </div>
                                <button
                                  onClick={editProfile}
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #1d9bf0",
                                    borderRadius: "4px",
                                    marginBottom: "10px",
                                    backgroundColor: "#000000",
                                    color: "white",
                                    width: "100px",
                                  }}
                                >
                                  Edit Profile
                                </button>
                              </form>
                            </div>
                          </Box>
                        </Fade>
                      </Modal>
                    </div>
                  ) : (
                    <div>
                      {isFollowing ? (
                        <button
                          variant="contained"
                          color="primary"
                          onClick={() => unfollow()}
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                          style={{
                            backgroundColor: "#000000",
                            color: isFollowHovered ? "red" : "white",
                            borderRadius: "20px",
                            padding: "10px 20px",
                            fontSize: "14px",
                            border: `1px solid ${
                              isFollowHovered ? "red" : "white"
                            }`,
                            cursor: "pointer",
                            fontWeight: "550",
                            width: "120px",
                          }}
                        >
                          {isFollowHovered ? "Unfollow" : "Following"}
                        </button>
                      ) : (
                        <button
                          variant="contained"
                          color="primary"
                          onClick={() => follow()}
                          style={{
                            backgroundColor: "#1d9bf0",
                            color: "white",
                            borderRadius: "20px",
                            padding: "10px 20px",
                            fontSize: "14px",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "550",
                            width: "120px",
                          }}
                        >
                          Follow
                        </button>
                      )}
                    </div>
                  )}
                  {userInfo.username === username && (
                    <button
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      style={{
                        backgroundColor: "#000000",
                        color: isHovered ? "red" : "white",
                        borderRadius: "20px",
                        padding: "0px",
                        fontSize: "14px",
                        border: `1px solid ${isHovered ? "red" : "white"}`,
                        cursor: "pointer",
                        fontWeight: "550",
                        width: "90px",
                        height: "30px",
                      }}
                      onClick={() => {
                        navigate("/logout");
                      }}
                    >
                      Logout
                    </button>
                  )}
                </div>
                <p
                  style={{
                    fontWeight: "bold",
                    marginTop: "0",
                    marginBottom: "0",
                  }}
                >
                  {user.displayName}
                </p>
                <p
                  style={{
                    color: "gray",
                    marginTop: "3px",
                    marginBottom: "0px",
                  }}
                >
                  @{user.username}
                </p>
                <p
                  style={{
                    color: "gray",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "3px",
                    marginBottom: "5px",
                  }}
                >
                  <CalendarMonthIcon
                    sx={{ fontSize: "medium", marginRight: "5px" }}
                  />
                  {formatJoinedDate(user.registrationDate)}
                </p>
                <div style={{ display: "flex" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "10px",
                    }}
                    onClick={() => {
                      navigate(`/${user.username}/following`);
                    }}
                  >
                    <div>{following}</div>{" "}
                    <div style={{ marginLeft: "4px", color: "gray" }}>
                      Following
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: "10px",
                    }}
                    onClick={() => {
                      navigate(`/${user.username}/followers`);
                    }}
                  >
                    <div>{followers}</div>{" "}
                    <div style={{ marginLeft: "4px", color: "gray" }}>
                      Followers
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <nav
              style={{
                width: "100%",
                backgroundColor: "#000000",
                display: "flex",
                justifyContent: isMobile ? "none" : "space-around",
                cursor: "pointer",
                padding: "10px",
                boxSizing: "border-box",
                overflowX: "auto",
              }}
            >
              <div
                style={tabStyle("posts")}
                onClick={() => handleTabClick("posts")}
              >
                Posts
              </div>
              <div
                style={tabStyle("replies")}
                onClick={() => handleTabClick("replies")}
              >
                Replies
              </div>
              <div
                style={tabStyle("mentions")}
                onClick={() => handleTabClick("mentions")}
              >
                Mentions
              </div>
              <div
                style={tabStyle("retweets")}
                onClick={() => handleTabClick("retweets")}
              >
                Retweets
              </div>
              <div
                style={tabStyle("likes")}
                onClick={() => handleTabClick("likes")}
              >
                Likes
              </div>
            </nav>
          </div>
          {results && activeTab == "posts" ? (
            results.tweets?.length > 0 ? (
              loadingTweets ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50px",
                  }}
                >
                  Loading...
                </div>
              ) : (
                <div>
                  {results.tweets.map((tweet) => (
                    <TweetResult key={tweet.id} tweet={tweet} />
                  ))}
                </div>
              )
            ) : shouldDisplayNoDataMessage ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px",
                }}
              >
                User has no posts...
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px",
                }}
              >
                Loading...
              </div>
            )
          ) : null}

          {results && activeTab == "replies" ? (
            results.tweets?.length > 0 ? (
              loadingTweets ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50px",
                  }}
                >
                  Loading...
                </div>
              ) : (
                <div>
                  {results.tweets.map((tweet) => (
                    <TweetResult key={tweet.id} tweet={tweet} />
                  ))}
                </div>
              )
            ) : (
              shouldDisplayNoDataMessage && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50px",
                  }}
                >
                  User has not replied to anything...
                </div>
              )
            )
          ) : null}

          {results && activeTab == "mentions" ? (
            results.tweets?.length > 0 ? (
              <div>
                {results.tweets.map((tweet) => (
                  <TweetResult key={tweet.id} tweet={tweet} />
                ))}
              </div>
            ) : (
              shouldDisplayNoDataMessage && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50px",
                  }}
                >
                  User has not been mentioned...
                </div>
              )
            )
          ) : null}

          {results && activeTab == "retweets" ? (
            results?.length > 0 ? (
              <div>
                {results.map((tweet) => (
                  <TweetResult key={tweet.id} tweet={tweet.originalTweet} />
                ))}
              </div>
            ) : (
              shouldDisplayNoDataMessage && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "50px",
                  }}
                >
                  User has not retweeted anything...
                </div>
              )
            )
          ) : null}

          {results && activeTab == "likes" ? (
            results.likes?.length > 0 ? (
              <div>
                {results.likes.map((tweet) => (
                  <TweetResult key={tweet.tweet.id} tweet={tweet.tweet} />
                ))}
              </div>
            ) : shouldDisplayNoDataMessage ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px",
                }}
              >
                User has not liked anything...
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "50px",
                }}
              >
                Loading...
              </div>
            )
          ) : null}
          <div style={{ height: "200px" }}></div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50px",
          }}
        >
          Loading...
        </div>
      )}
    </>
  );
}
