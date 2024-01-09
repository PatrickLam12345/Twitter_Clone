import { useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState(null);

  const [activeTab, setActiveTab] = useState("forYou");

  const handleTabClick = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }

    if (tab == "forYou") {

    }
    else {
        
    }
  };

  const tabStyle = (tab) => ({
    padding: '6px 25px',
    cursor: 'pointer',
    borderBottom: activeTab === tab ? '3px solid #1d9bf0' : 'none', 
    borderRadius: '2px',
    fontWeight: activeTab === tab ? 'bolder' : 'normal',
    color: activeTab === tab ? 'white' : 'gray'
  });

  return (
    <nav
      style={{
        width: "100%",
        backgroundColor: "#000000",
        display: "flex",
        justifyContent: "space-around",
        cursor: "pointer",
        padding: "10px",
        boxSizing: "border-box",
        border: "1px solid #333",
      }}
    >
      <div style={tabStyle("forYou")} onClick={() => handleTabClick("forYou")}>
        For You
      </div>
      <div style={tabStyle("following")} onClick={() => handleTabClick("following")}>
        Following
      </div>
    </nav>
  );
}
