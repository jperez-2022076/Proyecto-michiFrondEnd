import React from 'react';
import './Estilo.css'; // Importamos el CSS personalizado
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Importamos el icono de cerrar sesión
import logo from '../img/logo.png';

const Sidebar = ({ isSidebarVisible }) => {
  const navigate = useNavigate(); // Usa useNavigate

  // Obtén el rol del localStorage
  const rol = localStorage.getItem('rol');

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('rol'); // Elimina el rol del localStorage
    navigate('/login'); // Redirige al login
  };

  return (
    <ul
      className={`navbar-nav bg-gradient-primary sidebar sidebar-dark accordion ${isSidebarVisible ? 'show' : 'hide'}`}
      id="accordionSidebar"
    >
      {/* Contenedor con flexbox para organizar el contenido en columnas */}
      <div className="d-flex flex-column" style={{ height: '100vh' }}> {/* Esto extiende el sidebar a toda la altura */}
        
        {/* Sidebar - Brand */}
        <br />
        <div className="sidebar-brand d-flex align-items-center justify-content-center" >
          <img src={logo} alt="Toggle Sidebar" width="150" height="80" />
          <div className="sidebar-brand-text mx-3">OINSA</div>
        </div>

        {/* Divider */}
        <hr className="sidebar-divider my-0" />
        <br />

        {/* Condiciona la visualización según el rol */}
        {rol === 'ADMIN' ? (
          <>
            {/* Nav Item - Historial de Vehiculos */}
            <li className="nav-item">
              <button className="nav-link" onClick={() => navigate('/HistorialPV')}>
                <FontAwesomeIcon icon={faTruck} />
                <span> Historial De Vehiculos</span>
              </button>
            </li>

            {/* Nav Item - Historial de Personas */}
            <li className="nav-item">
              <button className="nav-link" onClick={() => navigate('/HistorialP')}>
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
            <li className="nav-item margen">
              <button className="nav-link" onClick={() => navigate('/Usuarios')}>
                <FontAwesomeIcon icon={faTruck} />
                <span> Usuarios</span>
              </button>
            </li>
            <hr className="sidebar-divider my-0" />
            <li className="nav-item">
              <button className="nav-link" onClick={() => navigate('/Guardian')}>
                <FontAwesomeIcon icon={faTruck} />
                <span> Buscar por escaner</span>
              </button>
            </li>
            <hr className="sidebar-divider my-0" />
          </>
        ) :
        <>
            <li className="nav-item">
              <button className="nav-link" onClick={() => navigate('/Guardian')}>
                <FontAwesomeIcon icon={faTruck} />
                <span> Buscar por escaner</span>
              </button>
            </li>
          <li className="nav-item">
              <button className="nav-link" onClick={() => navigate('/GuardianPorNombre')}>
                <FontAwesomeIcon icon={faTruck} />
                <span> Buscar por nombre</span>
              </button>
            </li>
</>
        }
         
        {/* Este div vacío se expande y empuja el botón de cerrar sesión hacia abajo */}
        <div className="flex-grow-1"></div>

        {/* Botón de cerrar sesión */}
        <li className="nav-item">
          <button className="nav-link" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span> Cerrar Sesión</span>
          </button>
        </li>
      </div>
    </ul>
  );
};

export default Sidebar;
