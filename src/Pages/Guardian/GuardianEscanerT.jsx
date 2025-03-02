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
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
const GuardianEscanerTelefono = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [screenshot, setScreenshot] = useState(null);
  const [barcode, setBarcode] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const hiddenInputRef = useRef(null);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [showButtons, setShowButtons] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [timeoutId, setTimeoutId] = useState(null);
  const [scannedId, setScannedId] = useState(null);
  const [isPersonFound, setIsPersonFound] = useState(false);
  const [scannedVehiculoId, setScannedVehiculoId] = useState(null);
  const [showGuestForm, setShowGuestForm] = useState(false); // Para controlar la visibilidad del formulario de invitado
  const [guestData, setGuestData] = useState({ nombre: '', dpi: '', placa: '', cliente: '' }); // Datos del invitado
  const [isGuestDataRetrieved, setIsGuestDataRetrieved] = useState(false);
  const { data: persona, loading: loadingPersona, error: errorPersona, isSuccess: isPersonSuccess } = useBuscarPersonaId(scannedId);
  const { data: vehiculo, loading: loadingVehiculo, error: errorVehiculo } = useBuscarVehiculoId(scannedVehiculoId);
  const [scanMessage, setScanMessage] = useState('Escanea una persona...');
  const { addHistorial, isLoading: isSavingHistorial } = useAgregarHistorialP();
  const { addHistorialPV, isLoading: isSavingHistorialPV } = useAgregarHistorialPV(); // Hook para historial PV


  const checkCameraPermissions = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: { exact: "environment" } // Usar la cámara trasera (environment)
        }
      })
      .then(() => {
        setHasCameraPermission(true);
      })
      .catch(() => {
        setHasCameraPermission(false);
        setErrorMessage('Permiso para la cámara denegado.');
      });
  };


  //Este es el metodo que tengo que cambiar
  const [isLoading, setIsLoading] = useState(false);
  
  const handleHiddenInputChange = (e) => {
    if (isLoading) return;

    const data = e.target.value;
    setIsLoading(true);

    if (timeoutId) {
        clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
        const id = data;

        if (id.startsWith('Invitado')) {
            const storedGuestData = JSON.parse(localStorage.getItem(id));
            if (storedGuestData) {
                setGuestData(storedGuestData);
                setIsGuestDataRetrieved(true);
            } else {
                setGuestData({ nombre: '', dpi: '', placa: '', cliente: '' });
                setIsGuestDataRetrieved(false);
            }
            setShowGuestForm(true);
            setShowButtons(false);
        } else {
              setIsPersonFound((prevIsPersonFound) => {
                if (!prevIsPersonFound) {
                    setScannedId(id);
                    return true; 
                } else {
                    setScannedVehiculoId(id);
                    
                    return prevIsPersonFound; 
                }
            });
            setShowButtons(true);
            
        }

        setInputValue('');
        e.target.value = '';

        setIsLoading(false);
    }, 1000);

    setTimeoutId(newTimeoutId);
};

const handleCancel = () => {
  handleReset(); 
};

<input
    type="text"
    ref={hiddenInputRef}
    style={{ position: 'absolute', left: '0', top: '0', width: '1px', height: '1px', opacity: 0.1 }}
    value={inputValue}
    onChange={handleHiddenInputChange}
    autoFocus
    disabled={isLoading}  // 🔴 Deshabilitar input si está cargando
/>

{isCameraOpen && (
    <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
        <BarcodeScannerComponent
            width="100%"
            height="300px"
            onUpdate={(err, result) => {
                if (!isLoading && result) {  // 🔴 Evitar escaneo si está cargando
                    handleHiddenInputChange({ target: { value: result.text } });
                }
            }}
            stopStream={false}
            onError={(err) => {
                console.error('Error al usar la cámara:', err);
                setErrorMessage('Error al usar la cámara.');
            }}
        />
    </div>
)}

useEffect(() => {
  if (vehiculo && Object.keys(vehiculo).length > 0) {
    const timer = setTimeout(() => {
      handleSaveHistorial();
    }, 1000);

    return () => clearTimeout(timer); 
  }
}, [vehiculo]);

  const handleSaveHistorial = async () => {
    const usuarioId = localStorage.getItem('id');
    const fechaActual = moment().format('YYYY-MM-DD');  // Usar la fecha local sin zona horaria
    const horaActual = moment().format('HH:mm:ss');  // Hora del dispositivo

    if (showGuestForm) {
      if (!guestData.nombre || !guestData.dpi || !guestData.placa || !guestData.cliente) {
        toast.error('Por favor, completa todos los campos del invitado.');
        return; // Detener ejecución si los campos no están llenos
      }
      // Guardar la información del invitado
      const dataHistorialPV = {
        nombre: guestData.nombre,
        DPI: guestData.dpi,
        placa: guestData.placa,
        cliente: guestData.cliente,
        usuario: usuarioId,
        fecha: fechaActual,
        hora: horaActual
      };

      // Guardar también en localStorage
      localStorage.setItem(scannedId, JSON.stringify(guestData));

      const response = await addHistorialPV(dataHistorialPV);

      if (!response.error) {
        if (isGuestDataRetrieved) {
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



  const handleReset = () => {
    setScannedId(null);
    setScannedVehiculoId(null);
    setShowButtons(false);
    setInputValue('');
    setIsPersonFound(false); 
    setShowGuestForm(false);
    setGuestData({ nombre: '', dpi: '', placa: '', cliente: '' });
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
      setIsPersonFound(false)
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
        {isLoading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Gris oscuro semitransparente
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000  // Asegurar que esté encima de todo
          }}>
            <FontAwesomeIcon icon={faSpinner} spin size="3x" color="white" />
          </div>
        )}





        <div id="content" className="d-flex flex-column align-items-center p-4 bg-custom-gradient flex-grow-1">
          <input
            type="text"
            ref={hiddenInputRef}
            style={{ position: 'absolute', left: '0', top: '0', width: '1px', height: '1px', opacity: 0.1 }}
            value={inputValue}
            onChange={handleHiddenInputChange}
            autoFocus
          />
          {isCameraOpen && (
            <div style={{ marginBottom: '20px', width: '100%', maxWidth: '400px' }}>
              <BarcodeScannerComponent
                width="100%"
                height="300px"
                onUpdate={(err, result) => {
                  if (!isLoading && result) { 
                    handleHiddenInputChange({ target: { value: result.text } });
                  }
                }}
                stopStream={false}
                onError={(err) => {
                  console.error('Error al usar la cámara:', err);
                  setErrorMessage('Error al usar la cámara.');
                }}
              />


            </div>
          )}
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
                <div className="form-group">
                  <label htmlFor="cliente">Cliente</label>
                  <input
                    type="text"
                    className="form-control"
                    id="cliente"
                    name="cliente"
                    value={guestData.cliente}
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
              style={scannedVehiculoId ? { width: '98%', height: '18%' } : { width: '98%', height: 'auto' }}
            >
              <div
                className={scannedVehiculoId
                  ? 'card-body d-flex align-items-center justify-content-between'
                  : 'card-body d-flex flex-column align-items-center'
                }
                style={{ height: '100%' }}
              >
                <div
                  className={`${scannedVehiculoId ? 'text-left' : 'text-center'}`}
                  style={scannedVehiculoId ? { width: '65%' } : { width: '100%' }} // Aseguramos que el texto ocupe la mitad del espacio
                >
                  <h5 className="card-title mb-0">{persona.nombre}</h5>
                  <h6 className="mt-2">DPI: {persona.DPI}</h6>
                </div>

                {scannedVehiculoId ? (
                  <div className="text-right" style={{ width: '50%' }}> {/* Aseguramos que la imagen ocupe el otro 50% */}
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
                <h4 className="card-title">Código: {vehiculo.codigo ? vehiculo.codigo : "Sin código"}</h4>
                <img className="persona-image" src={"https://res.cloudinary.com/dmyubpur2/image/upload/" + vehiculo.fotoV || 'Sin foto'} alt="Vehículo" style={{ width: '200px', height: '250px', objectFit: 'cover' }} />
              </div>
            </div>
          )}
          <br />
          <br />
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

export default GuardianEscanerTelefono;
