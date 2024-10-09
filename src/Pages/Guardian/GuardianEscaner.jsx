import React, { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from '../../componentes/Sidebar';
import Navbar from '../../componentes/Navbar';
import './guardian.css';
import useBuscarPersonaId from '../../shared/hooks/Persona/PersonaBuscarId';
import { useAgregarHistorialP } from '../../shared/hooks/HistorialP/HistorialPAgregar';
import moment from 'moment';

const GuardianEscaner = () => {
  const hiddenInputRef = useRef(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);
  const [scannedId, setScannedId] = useState(null);
  const [showButtons, setShowButtons] = useState(false); // Mostrar los botones de Guardar/Cancelar

  const { data: persona, loading, error } = useBuscarPersonaId(scannedId);
  const { addHistorial, isLoading: isSavingHistorial } = useAgregarHistorialP();

  const handleHiddenInputChange = (e) => {
    const data = e.target.value;
    setInputValue(data);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      console.log('Datos recibidos del escáner:', data);
      setScannedData(data);
      setScannedId(data.split('').reverse().join('')); // Invierte el ID como indicaste
      setShowButtons(true); // Mostrar los botones al escanear algo
      e.target.value = '';
      setInputValue('');
    }, 300);

    setTimeoutId(newTimeoutId);
  };

  const handleSaveHistorial = async () => {
    if (!persona) {
      toast.error('No se ha encontrado ninguna persona escaneada.');
      return;
    }

    const usuarioId = localStorage.getItem('id');
    const fechaActual = moment().toISOString();
    const horaActual = moment().format('HH:mm:ss');

    const data = { 
      persona: persona._id, 
      usuario: usuarioId, 
      fecha: fechaActual, 
      hora: horaActual 
    };

    const response = await addHistorial(data);

    if (!response.error) {
      toast.success('Historial de persona guardado exitosamente.');
      handleCancel(); // Resetea el estado después de guardar
      hiddenInputRef.current.focus(); // Enfoca el input después de guardar
    } else {
      toast.error('Error al guardar el historial.');
    }
};

const handleCancel = () => {
    setScannedData('');  // Limpia los datos escaneados
    setScannedId(null);  // Limpia el ID escaneado
    setShowButtons(false);  // Oculta los botones al cancelar
    setInputValue('');  // Limpia el valor del input
    hiddenInputRef.current.value = '';  // Limpia el campo oculto
    hiddenInputRef.current.focus(); // Enfoca el input después de cancelar
};


  useEffect(() => {
    hiddenInputRef.current.focus();
  }, []);

  useEffect(() => {
    const handleTouchStart = () => {
      hiddenInputRef.current.focus();
    };
  
    document.addEventListener('touchstart', handleTouchStart);
  
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return (
    <div id="wrapper" className={isSidebarVisible ? 'toggled' : ''}>
      <Toaster />
      <Sidebar isSidebarVisible={isSidebarVisible} />
      <div id="content-wrapper" className="d-flex flex-column full-height">
        <Navbar toggleSidebar={() => setSidebarVisible(!isSidebarVisible)} />
        <div id="content" className="d-flex flex-column align-items-center p-4 bg-custom-gradient flex-grow-1">
          <input
            type="text"
            ref={hiddenInputRef}
            style={{ position: 'absolute', left: '0', top: '0', width: '1px', height: '1px', opacity: 0.1 }}
            value={inputValue}
            onChange={handleHiddenInputChange}
            autoFocus
          />
          <h3>Escanea un código...</h3>
          <p>Datos escaneados: <strong>{scannedData}</strong></p>

          {loading && <p>Cargando información de la persona...</p>}
          {error && <p>Error al buscar persona: {error}</p>}
          {persona && scannedId && (
            <div className="card card-persona mt-5">
              <div className="card-body d-flex flex-column align-items-center">
                <h4 className="card-title">{persona.nombre}</h4>
                <p>DPI: {persona.DPI}</p>
                <img
                  className="persona-image"
                  src={persona.fotoP || 'Sin foto'}
                  alt="Persona"
                  style={{ width: '200px', height: '250px', objectFit: 'cover' }}
                />
              </div>
            </div>
          )}

          {showButtons && (
            <div className="d-flex mt-3" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
              <button className="btn btn-success mr-2" onClick={handleSaveHistorial} disabled={isSavingHistorial}>
                {isSavingHistorial ? 'Guardando...' : 'Guardar'}
              </button>
              <button className="btn btn-danger" onClick={handleCancel}>Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuardianEscaner;
