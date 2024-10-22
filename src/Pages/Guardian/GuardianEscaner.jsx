import React, { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from '../../componentes/Sidebar';
import Navbar from '../../componentes/Navbar';
import './guardian.css';
import useBuscarPersonaId from '../../shared/hooks/Persona/PersonaBuscarId';
import useBuscarVehiculoId from '../../shared/hooks/Vehiculo/VehiculoBuscarId';
import { useAgregarHistorialP } from '../../shared/hooks/HistorialP/HistorialPAgregar';
import { useAgregarHistorialPV } from '../../shared/hooks/HistorialP/HistorialPVAgregar'; // Importar hook para historial PV
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
  const [showGuestForm, setShowGuestForm] = useState(false); // Para controlar la visibilidad del formulario de invitado
  const [guestData, setGuestData] = useState({ nombre: '', dpi: '', placa: '' }); // Datos del invitado
  const [isGuestDataRetrieved, setIsGuestDataRetrieved] = useState(false); 
  const { data: persona, loading: loadingPersona, error: errorPersona, isSuccess: isPersonSuccess } = useBuscarPersonaId(scannedId);
  const { data: vehiculo, loading: loadingVehiculo, error: errorVehiculo } = useBuscarVehiculoId(scannedVehiculoId);
  const [scanMessage, setScanMessage] = useState('Escanea una persona...'); 
  const { addHistorial, isLoading: isSavingHistorial } = useAgregarHistorialP();
  const { addHistorialPV, isLoading: isSavingHistorialPV } = useAgregarHistorialPV(); // Hook para historial PV


  const handleHiddenInputChange = (e) => {
    const data = e.target.value;
    setInputValue(data);
  
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  
    const newTimeoutId = setTimeout(() => {
      const id = isMobile ? data.split('').reverse().join('') : data;
  
      if (id.startsWith('Invitado')) {
        setScannedId(id);
        
        // Recuperar información del invitado si ya existe
        const storedGuestData = JSON.parse(localStorage.getItem(id));
        if (storedGuestData) {
          setGuestData(storedGuestData);
          setIsGuestDataRetrieved(true)
        } else {
          setGuestData({ nombre: '', dpi: '', placa: '' }); // Reiniciar los datos si no existen
          setIsGuestDataRetrieved(false)
        }
        
        setShowGuestForm(true); // Mostrar el formulario para invitados
        setShowButtons(false);
        e.target.value = '';
        setInputValue('');
      } else {
        // Solo buscar personas si no es un invitado
        if (!isPersonFound) {
          setScannedId(id);
        } else {
          setScannedVehiculoId(id);
        }
      }
  
      setShowButtons(true);
      e.target.value = '';
      setInputValue('');
    }, 300);
  
    setTimeoutId(newTimeoutId);
  };
  
  const handleSaveHistorial = async () => {
    const usuarioId = localStorage.getItem('id');
    const fechaActual = moment().format('YYYY-MM-DD');  // Usar la fecha local sin zona horaria
    const horaActual = moment().format('HH:mm:ss');  // Hora del dispositivo
  
    if (showGuestForm) {
      if (!guestData.nombre || !guestData.dpi || !guestData.placa) {
        toast.error('Por favor, completa todos los campos del invitado.');
        return; // Detener ejecución si los campos no están llenos
    }
      // Guardar la información del invitado
      const dataHistorialPV = {
        nombre: guestData.nombre,
        DPI: guestData.dpi,
        placa: guestData.placa,
        usuario: usuarioId,
        fecha: fechaActual,
        hora: horaActual
      };
  
      // Guardar también en localStorage
      localStorage.setItem(scannedId, JSON.stringify(guestData));
  
      const response = await addHistorialPV(dataHistorialPV);
  
      if (!response.error) {
        if(isGuestDataRetrieved){
          localStorage.removeItem(scannedId);
        }
        toast.success('Historial de invitado agregado exitosamente.');
        handleReset(); // Reiniciar el formulario después de agregar
      } else {
        toast.error('Error al guardar el historial de invitado.');
      }
    } else if (isPersonFound && persona) {
      if (!scannedVehiculoId) {
        const dataHistorialP = {
          persona: persona._id,
          usuario: usuarioId,
          fecha: fechaActual,
          hora: horaActual
        };
  
        const response = await addHistorial(dataHistorialP);
  
        if (!response.error) {
          toast.success('Historial de persona agregado exitosamente.');
          handleReset();
        } else {
          toast.error('Error al guardar el historial de persona.');
        }
      }
  
      if (scannedVehiculoId) {
        const dataHistorialPV = {
          persona: persona._id,
          vehiculo: scannedVehiculoId,
          usuario: usuarioId,
          fecha: fechaActual,
          hora: horaActual
        };
  
        const vehicleResponse = await addHistorialPV(dataHistorialPV);
  
        if (!vehicleResponse.error) {
          toast.success('Historial de vehículo agregado exitosamente.');
          handleReset();
        } else {
          toast.error('Error al guardar el historial de vehículo.');
        }
      }
    } else {
      toast.error('No se ha encontrado una persona.');  // Este mensaje solo aparecerá si realmente no hay una persona.
    }
  };
  

  const handleCancel = () => {
    handleReset(); // Resetea el estado al cancelar
  };

  const handleReset = () => {
    setScannedId(null);
    setScannedVehiculoId(null);
    setShowButtons(false);
    setInputValue('');
    setIsPersonFound(false);
    setShowGuestForm(false); // Oculta el formulario al reiniciar
    setGuestData({ nombre: '', dpi: '', placa: '' }); // Resetear datos del invitado
    hiddenInputRef.current.value = '';
    hiddenInputRef.current.focus();
    setScanMessage('Escanea una persona...'); 
  };

  const handleGuestInputChange = (e) => {
    const { name, value } = e.target;
    setGuestData({ ...guestData, [name]: value });
  };

  useEffect(() => {
    if (isPersonSuccess) {
      setIsPersonFound(true);
      setShowGuestForm(false); // Ocultar formulario si se encuentra a la persona
   
      setScanMessage('Escanea un vehículo...'); // Cambiar mensaje al encontrar persona
    }
  }, [isPersonSuccess, persona]);

  useEffect(() => {
    if (scannedVehiculoId) {
      setScanMessage('Escanea un vehículo...'); // Cambiar mensaje al escanear vehículo
    }
  }, [scannedVehiculoId]);

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
    if (errorPersona && !scannedId.startsWith('Invitado')) {
      toast.error('Error al buscar persona.');
      setScannedId(null);
      setScannedVehiculoId(null);
    }
  }, [errorPersona]);
  useEffect(() => {
    if (errorVehiculo) {
      toast.error('Error al buscar vehículo.');
      setScannedId(null);
      setScannedVehiculoId(null);
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
                    <h4>{scanMessage}</h4> 

          {showGuestForm && (
            <div className="card mt-5" style={{ width: '98%' }}>
              <div className="card-body">
                <h5>Información del Invitado</h5>
                <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={guestData.nombre}
                    onChange={handleGuestInputChange}
                    maxLength={150}
                    
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="dpi">DPI</label>
                  <input
                    type="text"
                    className="form-control"
                    id="dpi"
                    name="dpi"
                    value={guestData.dpi}
                    onChange={handleGuestInputChange}
                    maxLength={13}
                    inputMode="numeric" // Para mostrar el teclado numérico en móviles
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="placa">Placa</label>
                  <input
                    type="text"
                    className="form-control"
                    id="placa"
                    name="placa"
                    value={guestData.placa}
                    onChange={handleGuestInputChange}
                    maxLength={100}
                    required
                  />
                </div>
                <div className="d-flex justify-content-end">
                  <button className="btn btn-success mr-2" onClick={handleSaveHistorial} disabled={isSavingHistorial || isSavingHistorialPV}>
                    {isSavingHistorial || isSavingHistorialPV ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button className="btn btn-danger" onClick={handleCancel}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

{isPersonFound && persona && (
  <div
    className="card mt-5"
    style={{ width: '98%' }}  // Elimina la altura fija
  >
    <div
      className={scannedVehiculoId
        ? 'card-body d-flex align-items-center justify-content-between'
        : 'card-body d-flex flex-column align-items-center'
      }
      style={{ height: 'auto' }} // Asegura que la altura se ajuste al contenido
    >
      <div
        className={`${scannedVehiculoId ? 'text-left' : 'text-center'}`}
        style={scannedVehiculoId ? { width: '50%' } : { width: '100%' }} // El texto ocupa la mitad si hay vehículo
      >
        <h5 className="card-title mb-0">{persona.nombre}</h5>
        <h6 className="mt-2">DPI: {persona.DPI}</h6>
      </div>

      {scannedVehiculoId ? (
        <div className="text-right" style={{ width: '50%' }}> {/* La imagen ocupa el otro 50% */}
          <img
            className="imagen"
            src={"https://res.cloudinary.com/dmyubpur2/image/upload/" + persona.fotoP || 'Sin foto'}
            alt="Persona"
            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
          />
        </div>
      ) : (
        <div className="mt-3">
          <img
            className="image_n"
            src={"https://res.cloudinary.com/dmyubpur2/image/upload/" + persona.fotoP || 'Sin foto'}
            alt="Persona"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        </div>
      )}
    </div>
  </div>
)}



          {isPersonFound && scannedVehiculoId && vehiculo && (
            <div className="card card-persona mt-5">
              <div className="card-body d-flex flex-column align-items-center">
                <h4 className="card-title">Placa: {vehiculo.placa}</h4>
                <h4 className="card-title">Código: {vehiculo.codigo? vehiculo.codigo : "Sin código"}</h4>
                <img className="persona-image" src={"https://res.cloudinary.com/dmyubpur2/image/upload/"+vehiculo.fotoV || 'Sin foto'} alt="Vehículo" style={{ width: '200px', height: '250px', objectFit: 'cover' }} />
              </div>
            </div>
          )}
  <br />
          {isPersonFound && showButtons && !showGuestForm && (
            <div className="d-flex mt-3" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
              <button className="btn btn-success mr-2" onClick={handleSaveHistorial} disabled={isSavingHistorial || isSavingHistorialPV}>
                {isSavingHistorial || isSavingHistorialPV ? 'Guardando...' : 'Guardar'}
              </button>
              <button className="btn btn-danger" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuardianEscaner;
