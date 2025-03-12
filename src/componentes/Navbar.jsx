import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import './Estilo.css';
import menuIcon from '../img/menu.png';

const Navbar = ({ toggleSidebar }) => {
  const rol = localStorage.getItem('rol');
  const [torchOn, setTorchOn] = useState(() => localStorage.getItem('torchOn') === 'true');
  const trackRef = useRef(null);

  const setupCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      trackRef.current = stream.getVideoTracks()[0];
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      alert("No se pudo acceder a la cámara para usar la linterna.");
    }
  };

  const toggleFlash = async (forceState = null) => {
    try {
      if (!trackRef.current) {
        await setupCamera();
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
      alert("No se pudo activar el flash.");
    }
  };

  useEffect(() => {
    if (torchOn) {
      toggleFlash(true);
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && localStorage.getItem('torchOn') === 'true') {
        toggleFlash(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
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
