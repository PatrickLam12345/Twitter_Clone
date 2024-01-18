import { useEffect, useState } from "react";
import axios from "axios";

export default function TweetMedia({ stopPropagation, s3Key }) {
  const [imageSrc, setImageSrc] = useState(null);
  useEffect(() => {
    const getS3Image = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/getS3Media",
          {
            headers: {
              authorization: window.localStorage.getItem("token"),
            },
            params: {
              s3Key,
            },
            responseType: "arraybuffer",
          }
        );
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error Fetching:", error);
      }
    };

    getS3Image();
  }, []);

  return imageSrc ? (
    <div style={{ width: "100%" }}>
      <img
        src={imageSrc}
        onClick={(e) => {
          stopPropagation(e);
        }}
        style={{ maxHeight: "175px" }}
      />
    </div>
  ) : null;
}
