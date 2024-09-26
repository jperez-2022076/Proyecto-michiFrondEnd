import React from 'react';
import './Estilo.css'; // Importamos el CSS personalizado
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

const Sidebar = ({ isSidebarVisible }) => {
  const navigate = useNavigate(); // Usa useNavigate

  return (
    <ul
      className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${isSidebarVisible ? 'show' : 'hide'}`}
      id="accordionSidebar"
    >
      {/* Sidebar - Brand */}
      <div className="sidebar-brand d-flex align-items-center justify-content-center" onClick={() => navigate('/')}>
        <div className="sidebar-brand-icon rotate-n-15">
          <i className="fas fa-laugh-wink"></i>
        </div>
        <div className="sidebar-brand-text mx-3">SB Admin <sup>2</sup></div>
      </div>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />

      {/* Nav Item - Historial de Vehiculos */}
      <li className="nav-item">
        <button className="nav-link" onClick={() => navigate('/login')}>
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Historial De Vehiculos</span>
        </button>
      </li>

      {/* Nav Item - Historial de Personas */}
      <li className="nav-item">
        <button className="nav-link" onClick={() => navigate('/')}>
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Historial De Personas</span>
        </button>
      </li>

      <div className="sidebar-heading">Administrar</div>

      <hr className="sidebar-divider my-0" />

      {/* Nav Item - Vehiculos */}
      <li className="nav-item">
        <button className="nav-link" onClick={() => navigate('/')}>
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Vehiculos</span>
        </button>
      </li>

      {/* Nav Item - Personas */}
      <li className="nav-item">
        <button className="nav-link" onClick={() => navigate('/Personas')}>
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Personas</span>
        </button>
      </li>

      {/* Nav Item - Usuarios */}
      <li className="nav-item">
        <button className="nav-link" onClick={() => navigate('/Usuarios')}>
          <i className="fas fa-fw fa-tachometer-alt"></i>
          <span>Usuarios</span>
        </button>
      </li>

      {/* Other nav items... */}
    </ul>
  );
};

export default Sidebar;
