// components/SearchBar.js
import React from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, searchQuery }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Pokemon..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        className="search-input"
      />
      <button className="search-button" onClick={() => onSearch(searchQuery)}>
        🔍
      </button>
    </div>
  );
};

export default SearchBar;
