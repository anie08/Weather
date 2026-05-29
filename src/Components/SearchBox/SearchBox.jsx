import React from "react";
import "./SearchBox.css";

function SearchBox({ inputValue, setInputValue, onSearch }) {
  return (
    <form className="search-box" onSubmit={onSearch}>
      <input
        type="text"
        placeholder="Enter city name..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default SearchBox;