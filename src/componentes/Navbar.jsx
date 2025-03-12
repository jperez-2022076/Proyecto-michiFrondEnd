import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import './Estilo.css';
import menuIcon from '../img/menu.png';

const Navbar = ({ toggleSidebar }) => {
  const rol = localStorage.getItem('rol');
  const [torchOn, setTorchOn] = useState(() => {
    return localStorage.getItem('torchOn') === 'true';
  });

  let track = null;

  const toggleFlash = async (forceState = null) => {
    try {
      if (!track) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        track = stream.getVideoTracks()[0];
      }
      if (track) {
        const capabilities = track.getCapabilities();
        if (capabilities.torch) {
          const newState = forceState !== null ? forceState : !torchOn;
          await track.applyConstraints({ advanced: [{ torch: newState }] });
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
      toggleFlash(true);
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
