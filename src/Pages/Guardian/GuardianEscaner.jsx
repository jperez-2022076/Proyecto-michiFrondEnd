import React, { useEffect, useRef, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../../componentes/Sidebar';
import Navbar from '../../componentes/Navbar';
import './guardian.css';

const GuardianEscaner = () => {
  const hiddenInputRef = useRef(null); // Referencia al input oculto
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [scannedData, setScannedData] = useState(''); // Estado para almacenar los datos escaneados
  const [inputValue, setInputValue] = useState(''); // Estado para manejar el valor del input
  const [timeoutId, setTimeoutId] = useState(null); // Para manejar el temporizador

  // Función que captura los datos del escáner
  const handleHiddenInputChange = (e) => {
    const data = e.target.value; // Captura el valor escaneado
    setInputValue(data); // Actualiza el estado del valor del input

    // Limpia el temporizador anterior
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    // Establece un nuevo temporizador para actualizar el estado después de un pequeño retraso
    const newTimeoutId = setTimeout(() => {
      console.log('Datos recibidos del escáner:', data); // Muestra los datos escaneados en la consola
      setScannedData(data.split('').reverse().join('')); // Invierte los datos antes de actualizar el estado
      e.target.value = ''; // Limpia el input oculto después de procesar los datos
      setInputValue(''); // Limpia el estado del valor del input
    }, 300); // Espera 300ms antes de procesar el dato

    setTimeoutId(newTimeoutId); // Guarda el ID del temporizador
  };

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    // Establece el foco en el input oculto cuando el componente se monta
    hiddenInputRef.current.focus();
  }, []);

  return (
    <div id="wrapper" className={isSidebarVisible ? 'toggled' : ''}>
      <Toaster />
      <Sidebar isSidebarVisible={isSidebarVisible} />
      <div id="content-wrapper" className="d-flex flex-column full-height">
        <Navbar toggleSidebar={toggleSidebar} />
        <div id="content" className="d-flex flex-column align-items-center p-4 bg-custom-gradient flex-grow-1">
          <input
            type="text"
            ref={hiddenInputRef}
            style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }} // Oculto visualmente pero accesible
            value={inputValue} // Maneja el valor del input a través del estado
            onChange={handleHiddenInputChange} // Captura el valor escaneado
            autoFocus // Asegúrate de que el input esté en foco
          />
          <h3>Escanea un código...</h3>
          <p>Datos escaneados: <strong>{scannedData}</strong></p> {/* Muestra los datos escaneados en una línea */}
        </div>
      </div>
    </div>
  );
};

export default GuardianEscaner;
