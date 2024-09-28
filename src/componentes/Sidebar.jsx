import React from 'react';
import './Estilo.css'; // Importamos el CSS personalizado
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faTachometerAlt } from '@fortawesome/free-solid-svg-icons';
import logo from '../img/logo.png';
const Sidebar = ({ isSidebarVisible }) => {
  const navigate = useNavigate(); // Usa useNavigate

  return (
    <ul
      className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${isSidebarVisible ? 'show' : 'hide'}`}
      id="accordionSidebar"
    >
      {/* Sidebar - Brand */}
      <br />
      <div className="sidebar-brand d-flex align-items-center justify-content-center" onClick={() => navigate('/')}>
     
        <img src={logo} alt="Toggle Sidebar" width="150" height="80" />
       
        <div className="sidebar-brand-text mx-3">OINSA </div>
      </div>

      {/* Divider */}
      <hr className="sidebar-divider my-0" />
    <br />
      {/* Nav Item - Historial de Vehiculos */}
      <li className="nav-item">
        <button className="nav-link" onClick={() => navigate('/login')}>
        <FontAwesomeIcon icon={faTruck} /> 
          <span> Historial De Vehiculos</span>
        </button>
      </li>

      {/* Nav Item - Historial de Personas */}
      <li className="nav-item">
        <button className="nav-link" onClick={() => navigate('/')}>
        <FontAwesomeIcon icon={faTruck} /> 
          <span> Historial De Personas</span>
        </button>
      </li>

      <div className="sidebar-heading">Administrar</div>

      <hr className="sidebar-divider my-0" />

      {/* Nav Item - Vehiculos */}
      <li className="nav-item">
        <button className="nav-link" onClick={() => navigate('/Vehiculos')}>
        <FontAwesomeIcon icon={faTruck} /> 
          <span> Vehiculos</span>
        </button>
      </li>

      {/* Nav Item - Personas */}
      <li className="nav-item">
        <button className="nav-link" onClick={() => navigate('/Personas')}>
        <FontAwesomeIcon icon={faTruck} /> 
          <span> Personas</span>
        </button>
      </li>

      {/* Nav Item - Usuarios */}
      <li className="nav-item">
        <button className="nav-link" onClick={() => navigate('/Usuarios')}>
        <FontAwesomeIcon icon={faTruck} /> 
          <span> Usuarios</span>
        </button>
      </li>

      {/* Other nav items... */}
    </ul>
  );
};

export default Sidebar;
