import React from 'react';
import menuIcon from '../img/menu.png';
import './Estilo.css'; 

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top ">
      <button className="btn btn-link rounded-circle mr-3" onClick={toggleSidebar}>
      <img src={menuIcon} alt="Toggle Sidebar" width="30" height="30" />
      </button>
    </nav>
  );
};

export default Navbar;
