// BottomNavBar.jsx

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './BottomNavBar.css';

const BottomNavBar = () => {
  const location = useLocation();

  return (
    <footer>
      <NavLink to="/" activeclassname="active" className={location.pathname === '/' && 'active'}>
        <i className="material-icons">Home</i>
      </NavLink>
      <NavLink to="/about" activeclassname="active" className={location.pathname === '/about' && 'active'}>
        <i className="material-icons">About</i>
      </NavLink>
      <NavLink to="/info" activeclassname="active" className={location.pathname === '/info' && 'active'}>
        <i className="material-icons">Info</i>
      </NavLink>
      <NavLink to="/contact" activeclassname="active" className={location.pathname === '/contact' && 'active'}>
        <i className="material-icons">Contact</i>
      </NavLink>
      
    </footer>
  );
};

export default BottomNavBar;
