import { useEffect, useState } from "react";
import axios from "axios";

export default function TweetMedia({ stopPropagation, s3Key }) {
  const [result, setResult] = useState(null)
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
          }
        );
        console.log(response)
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        console.log(contentType);
        const imageUrl = URL.createObjectURL(blob);
        
        setResult(imageUrl);
        console.log(imageUrl);
      } catch (error) {
        console.error("Error Fetching:", error);
      }
    };

    // getS3Image();
  }, []);

  return (
    <div
      onClick={(e) => {
        stopPropagation(e);
      }}
      style={{ width: "100%" }}
    >
      {result && <img src={result} alt="S3 Image" />}
    </div>
  );
}
