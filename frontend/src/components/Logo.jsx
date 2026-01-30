import React from 'react';

const Logo = () => {
  return (
    <div className="logo-container">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M3 3h2l.4 2M7 13h10l3-8H6.4" 
          stroke="#2e7d32" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle cx="10" cy="20" r="1" fill="#2e7d32"/>
        <circle cx="18" cy="20" r="1" fill="#2e7d32"/>
      </svg>
      <span className="brand-name">QuickCart</span>
    </div>
  );
};

export default Logo;
