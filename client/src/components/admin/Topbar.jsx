import React from 'react';
import { FaSearch, FaBell } from 'react-icons/fa';

const Topbar = () => {
  return (
    <div className="topbar">
      <div className="search-bar">
        <FaSearch className="search-icon" />
        <input type="text" placeholder="Search..." />
      </div>
      <div className="topbar-actions">
        <button className="notification-btn">
          <FaBell />
          <span className="notification-badge">3</span>
        </button>
        <div className="profile-dropdown">
          <img src="https://ui-avatars.com/api/?name=Admin+User&background=3C6E71&color=fff" alt="Admin Profile" />
          <span>Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
