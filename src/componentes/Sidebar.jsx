import React from 'react';
import './Estilo.css'; // Importamos el CSS personalizado

const Sidebar = ({ isSidebarVisible }) => {
  return (
    <ul
      className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${isSidebarVisible ? 'show' : 'hide'}`}
      id="accordionSidebar"
    >
      {/* Sidebar - Brand */}
      <a className="sidebar-brand d-flex align-items-center justify-content-center" href="index.html">
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink"></i>
        </div>
        <div className="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
      </a>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

      {/* Nav Item - Dashboard */}
      <li className="nav-item">
        <a className="nav-link" href="/login">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Historial De Vehiculos</span>
        </a>
      </li>
   
      <li className="nav-item">
        <a className="nav-link" href="index.html">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Historial De Personas</span>
        </a>
      </li>
      <div class="sidebar-heading">
                Administrar
            </div>

      <hr className="sidebar-divider my-0" />
      <li className="nav-item">
        <a className="nav-link" href="index.html">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Vehiculos</span>
        </a>
      </li>
  
      <li className="nav-item">
        <a className="nav-link" href="/Personas">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Personas</span>
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/Usuarios">
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Usuarios</span>
        </a>
      </li>

      {/* Other nav items... */}
    </ul>
  );
};

export default Sidebar;
