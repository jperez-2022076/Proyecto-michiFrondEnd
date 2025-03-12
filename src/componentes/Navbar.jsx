import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import './Estilo.css';
import menuIcon from '../img/menu.png';

const Navbar = ({ toggleSidebar }) => {
  const rol = localStorage.getItem('rol');
  const [torchOn, setTorchOn] = useState(() => localStorage.getItem('torchOn') === 'true');
  const trackRef = useRef(null); // 🔹 Mantiene el `track` entre renders

  const toggleFlash = async (forceState = null) => {
    try {
      if (!trackRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        trackRef.current = stream.getVideoTracks()[0]; // 🔹 Guardamos el track en `useRef`
      }

      if (trackRef.current) {
        const capabilities = trackRef.current.getCapabilities();
        if (capabilities.torch) {
          const newState = forceState !== null ? forceState : !torchOn;
          await trackRef.current.applyConstraints({ advanced: [{ torch: newState }] });
          setTorchOn(newState);
          localStorage.setItem('torchOn', newState);
        } else {
          alert("Tu dispositivo no soporta el uso del flash.");
        }
      }
    } catch (error) {
      console.error("Error al controlar el flash:", error);
      alert("No se pudo acceder al flash.");
    }
  };

  useEffect(() => {
    if (torchOn) {
      toggleFlash(true); // 🔹 Si estaba encendida antes, la encendemos de nuevo
    }
  }, []); // Se ejecuta al montar el componente

  return (
    <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top">
      <button className="btn btn-link rounded-circle mr-3" onClick={toggleSidebar}>
        <img src={menuIcon} alt="Toggle Sidebar" width="30" height="30" />
      </button>
      {rol === 'GUARDIAN' && (
        <div className="ml-auto">
          <button className="btn btn-link" onClick={() => toggleFlash()} style={{ fontSize: '25px', marginTop: '15px', marginRight: '5px' }}>
            <FontAwesomeIcon icon={faLightbulb} size="lg" color={torchOn ? "yellow" : "gray"} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
