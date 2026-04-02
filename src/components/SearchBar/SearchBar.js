import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchSearchResults, setSearchTerm } from '../../store/slices/postsSlice';
import './SearchBar.css';

const SearchBar = () => {
  const [inputValue, setInputValue] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      dispatch(setSearchTerm(inputValue.trim()));
      dispatch(fetchSearchResults(inputValue.trim()));
    }
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <div className="search-bar__input-wrapper">
        <svg className="search-bar__icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          className="search-bar__input"
          placeholder="Search Reddit..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          aria-label="Search Reddit"
        />
        {inputValue && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={handleClear}
            aria-label="Clear search"
          >
            &times;
          </button>
        )}
      </div>
      <button type="submit" className="search-bar__button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
