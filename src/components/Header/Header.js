import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header__logo">
        <svg className="header__icon" viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
          <circle cx="12" cy="12" r="11" fill="#FF4500"/>
          <circle cx="8.5" cy="10" r="1.5" fill="white"/>
          <circle cx="15.5" cy="10" r="1.5" fill="white"/>
          <path d="M7 14c0 0 2 3 5 3s5-3 5-3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <circle cx="18" cy="5" r="1" fill="#FF4500"/>
          <line x1="14" y1="3" x2="18" y2="5" stroke="#FF4500" strokeWidth="1.2"/>
          <circle cx="14" cy="3" r="1.5" fill="none" stroke="#FF4500" strokeWidth="1.2"/>
        </svg>
        <h1 className="header__title">
          Reddit<span className="header__title-accent">Lite</span>
        </h1>
      </div>
      <SearchBar />
    </header>
  );
};

export default Header;
