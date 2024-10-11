import React, { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from '../../componentes/Sidebar';
import Navbar from '../../componentes/Navbar';
import './guardian.css';
import useBuscarPersonaId from '../../shared/hooks/Persona/PersonaBuscarId';
import useBuscarVehiculoId from '../../shared/hooks/Vehiculo/VehiculoBuscarId';
import { useAgregarHistorialP } from '../../shared/hooks/HistorialP/HistorialPAgregar';
import moment from 'moment';

const GuardianEscaner = () => {
  const hiddenInputRef = useRef(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);
  const [scannedId, setScannedId] = useState(null);
  const [showButtons, setShowButtons] = useState(false);
  const [isPersonFound, setIsPersonFound] = useState(false);
  const [scannedVehiculoId, setScannedVehiculoId] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Obtener datos de persona y vehículo
  const { data: persona, loading: loadingPersona, error: errorPersona, isSuccess: isPersonSuccess } = useBuscarPersonaId(scannedId);
  const { data: vehiculo, loading: loadingVehiculo, error: errorVehiculo } = useBuscarVehiculoId(scannedVehiculoId);
  const { addHistorial, isLoading: isSavingHistorial } = useAgregarHistorialP();

  const handleHiddenInputChange = (e) => {
    const data = e.target.value;
    setInputValue(data);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      const id = isMobile ? data.split('').reverse().join('') : data;

      if (!isPersonFound) {
        setScannedId(id);
      } else {
        setScannedVehiculoId(id);
      }

      setShowButtons(true);
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
      handleReset(); // Resetea el estado después de guardar
    } else {
      toast.error('Error al guardar el historial.');
    }
  };

  const handleCancel = () => {
    handleReset(); // Resetea el estado al cancelar
  };

  const handleReset = () => {
    // Reiniciar todos los estados
    setScannedId(null);
    setScannedVehiculoId(null);
    setShowButtons(false);
    setInputValue('');
    setIsPersonFound(false);
    hiddenInputRef.current.value = '';
    hiddenInputRef.current.focus();
  };

  useEffect(() => {
    if (isPersonSuccess) {
      setIsPersonFound(true); // Marca que ya se encontró a la persona
      console.log('Persona encontrada:', persona); // Mostrar la persona en la consola
    }
  }, [isPersonSuccess, persona]);

  useEffect(() => {
    hiddenInputRef.current.focus();
  }, []);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const isMobileDevice = /android|iPad|iPhone|iPod/.test(userAgent.toLowerCase());
    setIsMobile(isMobileDevice);
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

  useEffect(() => {
    if (errorPersona) {
      toast.error('Error al buscar persona.');
    }
  }, [errorPersona]);

  useEffect(() => {
    if (errorVehiculo) {
      toast.error('Error al buscar vehículo.');
    }
  }, [errorVehiculo]);

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

          {loadingPersona && <p>Cargando información de la persona...</p>}
          {isPersonFound && persona && (
  <div className="card mt-5" style={scannedVehiculoId ? { width: '98%', height: '15%' } : { width: '98%', height: 'auto' }}>
    <div 
      className={scannedVehiculoId 
        ? 'card-body d-flex align-items-center justify-content-between' 
        : 'card-body d-flex flex-column align-items-center'} 
      style={{ height: '100%' }}
    >
      <div className={`${scannedVehiculoId ? 'text-left' : 'text-center'}`}>
        <h5 className="card-title mb-0">{persona.nombre}</h5>
        <h6 className="mt-2">DPI: {persona.DPI}</h6>
      </div>

      {/* Si no hay vehículo, centramos la imagen debajo del nombre y DPI */}
      {scannedVehiculoId ? (
        <div className="text-right">
          <img 
            className="imagen" 
            src={persona.fotoP || 'Sin foto'} 
            alt="Persona" 
            style={{ 
              width: '80px', 
              height: '80px', 
              objectFit: 'cover' 
            }} 
          />
        </div>
      ) : (
        <div className="mt-3">
          <img 
            className="image_n" 
            src={persona.fotoP || 'Sin foto'} 
            alt="Persona" 
            style={{ 
              width: '150px', 
              height: '150px', 
              objectFit: 'cover' 
            }} 
          />
        </div>
      )}
    </div>
  </div>
)}


          {/* Verifica si hay un vehículo escaneado antes de mostrarlo */}
          {isPersonFound && scannedVehiculoId && vehiculo && (
            <div className="card card-persona mt-5">
              <div className="card-body d-flex flex-column align-items-center">
                <h4 className="card-title">Placa: {vehiculo.placa}</h4>
                <img className="persona-image" src={vehiculo.fotoV || 'Sin foto'} alt="Vehículo" style={{ width: '200px', height: '250px', objectFit: 'cover' }} />
              </div>
            </div>
          )}

          {isPersonFound && showButtons && (
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
