import React, { useState } from "react";

const SearchBar = ({ onSearch, onReset }) => {
  const [position, setPosition] = useState("");

  const handleSearch = () => {
    onSearch(position);
  };

  const handleReset = () => {
    setPosition("");
    onReset();
  };

  const buttonStyle = {
    padding: "8px 14px",
    border: "1px solid #ccc",
    backgroundColor: "#f5f5f5",
    cursor: "pointer",
    transition: "all 0.15s ease",
  };

  const hoverStyle = (e, isEnter) => {
    e.target.style.backgroundColor = isEnter ? "#e5e5e5" : "#f5f5f5";
  };

  return (
    <div style={{ display: "flex", gap: "8px", padding: "20px" }}>
      <input
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        placeholder="직급으로 검색 (예: 과장)"
        style={{
          border: "1px solid #ccc",
          padding: "8px",
          width: "240px",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearch();
        }}
      />

      {/* 🔍 검색 버튼 */}
      <button
        onClick={handleSearch}
        style={buttonStyle}
        onMouseEnter={(e) => hoverStyle(e, true)}
        onMouseLeave={(e) => hoverStyle(e, false)}
      >
        검색
      </button>

      {/* 🔄 전체보기 버튼 */}
      <button
        onClick={handleReset}
        style={buttonStyle}
        onMouseEnter={(e) => hoverStyle(e, true)}
        onMouseLeave={(e) => hoverStyle(e, false)}
      >
        전체보기
      </button>
    </div>
  );
};

export default SearchBar;