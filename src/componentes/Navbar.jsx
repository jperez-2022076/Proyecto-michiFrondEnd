import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons'; // Importamos los íconos
import './Estilo.css';
import menuIcon from '../img/menu.png'


const Navbar = ({ toggleSidebar }) => {
  const rol = localStorage.getItem('rol');
  const [torchOn, setTorchOn] = useState(false);
  let track = null;

  const toggleFlash = async () => {
    try {
      if (!track) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        track = stream.getVideoTracks()[0];
      }
      if (track) {
        const capabilities = track.getCapabilities();
        if (capabilities.torch) {
          track.applyConstraints({ advanced: [{ torch: !torchOn }] });
          setTorchOn(!torchOn);
        } else {
          alert("Tu dispositivo no soporta el uso del flash.");
        }
      }
    } catch (error) {
      console.error("Error al controlar el flash:", error);
      alert("No se pudo acceder al flash.");
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top">
        <button className="btn btn-link rounded-circle mr-3" onClick={toggleSidebar}>
          <img src={menuIcon} alt="Toggle Sidebar" width="30" height="30" />
        </button>
        {rol === 'GUARDIAN' && (
          <div className="ml-auto">
            <button className="btn btn-link" onClick={toggleFlash} style={{ fontSize: '25px', marginTop: '15px', marginRight: '5px' }}>
              <FontAwesomeIcon icon={faLightbulb} size="lg" color={torchOn ? "yellow" : "gray"} />
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
