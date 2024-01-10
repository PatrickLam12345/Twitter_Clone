import { useEffect, useState } from "react";

export default function TweetMedia({ stopPropagation, s3Key }) {
  console.log(s3Key, "tweet");
  const [xmlContent, setXmlContent] = useState("");
  const S3ObjectUrl = `https://twitterclonebucket2024.s3.us-east-2.amazonaws.com/${s3Key}`;

  useEffect(() => {
    fetch(S3ObjectUrl)
      .then((response) => response.text())
      .then((data) => setXmlContent(data))
      .catch((error) => console.error("Error fetching XML:", error));
  }, []);

  return (
    <div
      onClick={(e) => {
        stopPropagation(e);
      }}
      style={{ width: "100%" }}
    >
      <pre style={{ width: "100%" }}>{xmlContent}</pre>
    </div>
  );
}
