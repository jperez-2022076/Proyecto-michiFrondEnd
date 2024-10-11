import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Toaster, toast } from 'react-hot-toast';
import './guardian.css';
import useBuscarPersonaNombre from '../../shared/hooks/Persona/PersonaBuscar';
import useBuscarVehiculoPlaca from '../../shared/hooks/Vehiculo/VehiculoBuscar';
import { useAgregarHistorialP } from '../../shared/hooks/HistorialP/HistorialPAgregar';
import { useAgregarHistorialPV } from '../../shared/hooks/HistorialP/HistorialPVAgregar';
import Sidebar from '../../componentes/Sidebar';
import Navbar from '../../componentes/Navbar';
import moment from 'moment';

const Guardian = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCards, setFilteredCards] = useState([]);
  const [addedCards, setAddedCards] = useState([]);
  const [showButtons, setShowButtons] = useState(false);
  const [searchingVehicles, setSearchingVehicles] = useState(false);
  const { addHistorial, isLoading } = useAgregarHistorialP();
  const { addHistorialPV, isLoading: isLoadingHistorialPV } = useAgregarHistorialPV();

  const { personas, loading: loadingPersonas, error: errorPersonas, buscarPersona } = useBuscarPersonaNombre();
  const { vehiculos: filteredVehicles, loading: loadingVehiculos, error: errorVehiculos, buscarVehiculo } = useBuscarVehiculoPlaca();

  const handleSearch = () => {
    if (addedCards.length >= 2) {
      toast.error('Solo se puede seleccionar una persona y un vehículo');
      return;
    }
    if (searchingVehicles) {
      buscarVehiculo(searchTerm);
    } else {
      buscarPersona(searchTerm);
    }
  };

  const handleAddCard = (card) => {
    if (!addedCards.includes(card)) {
      setAddedCards([...addedCards, card]);
      setShowButtons(true);
      setSearchTerm('');
      setFilteredCards([]);
      setSearchingVehicles(true);
    }
  };

  const handleCancel = () => {
    setAddedCards([]);
    setShowButtons(false);
    setSearchingVehicles(false);
    setSearchTerm('');
    setFilteredCards([]);
  };

  useEffect(() => {
    if (personas.length > 0) {
      setFilteredCards(personas);
    } else if (errorPersonas) {
      toast.error('No se encontraron personas.');
    }
  }, [personas, errorPersonas]);

  useEffect(() => {
    if (filteredVehicles.length > 0) {
      setFilteredCards(filteredVehicles);
    } else if (errorVehiculos) {
      toast.error('No se encontraron vehículos.');
    }
  }, [filteredVehicles, errorVehiculos]);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleInputChange = (e) => {
    if (addedCards.length >= 2) {
      toast.error('Solo se puede seleccionar una persona y un vehículo');
    } else {
      setSearchTerm(e.target.value);
    }
  };

  const handleSave = async () => {
    const usuarioId = localStorage.getItem('id'); // Obtén el ID del usuario del localStorage
    const fechaActual = moment().subtract(1, 'days').toISOString(); // Formato ISO 8601
    const horaActual = moment().format('HH:mm:ss'); // Formato 24 horas

    if (addedCards.length === 2) {
      const personaId = addedCards[0]._id;
      const vehiculoId = addedCards[1]._id;
      console.log(personaId)
      console.log(vehiculoId)
      const dataHistorialPV = { 
        persona: personaId, 
        vehiculo: vehiculoId,
        usuario: usuarioId, 
        fecha: fechaActual, 
        hora: horaActual 
      };

      const response = await addHistorialPV(dataHistorialPV); // Llama al hook para agregar historial de vehículo

      if (!response.error) {
        toast.success('Historial de vehículo agregado exitosamente');
      }
      handleCancel();
      
    } else if (addedCards.length === 1) {
      const personaId = addedCards[0]._id; // Obtén el ID de la persona

      const data = { 
        persona: personaId, 
        usuario: usuarioId, 
        fecha: fechaActual, 
        hora: horaActual 
      };

      const response = await addHistorial(data); // Llama al hook para agregar historial de persona

      if (!response.error) {
        toast.success('Historial de persona agregado exitosamente');
      }
      handleCancel();
      
    } else {
      toast.error('Debes seleccionar al menos una persona y un vehículo antes de guardar.');
    }
  };

  return (
    <div id="wrapper" className={isSidebarVisible ?   'toggled': ''}>
      <Toaster />
      <Sidebar isSidebarVisible={isSidebarVisible} />
      <div id="content-wrapper" className="d-flex flex-column full-height">
        <Navbar toggleSidebar={toggleSidebar} />
        <div id="content" className="d-flex flex-column align-items-center p-4 bg-custom-gradient flex-grow-1">
          <div className="search-bar w-100 d-flex mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              className="form-control"
              placeholder={searchingVehicles ? "Buscar Vehículo..." : "Buscar Persona..."}
              style={{ marginRight: '10px' }}
              disabled={addedCards.length >= 2}
            />
            <button className="btn btn-primary" onClick={handleSearch} disabled={loadingPersonas || loadingVehiculos || addedCards.length >= 2}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>

          {(loadingPersonas || loadingVehiculos) && <p>Buscando...</p>}
          <br />
          <div className="mt-5 pt-5 container flex-grow-1">
            {addedCards.length > 0 && (
              <div className="added-cards">
                <div className="row">
                  {addedCards.map((card) => (
                    <div key={card.id} className="col mb-2 w-100 d-flex mb-3">
                      <div className={`card added-card`}>
                        <div className="card-body">
                          <h5 className="card-title">{card.nombre || card.placa}</h5>
                          <img
                            className='imagen'
                            src={card.fotoP || card.fotoV}
                            alt={`Sin foto`}
                            style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 pt-3 container" style={{ width: '100%' }}>
            <div className="row">
              {filteredCards.map(item => (
                <div key={item._id || item.id} className="col mb-2" style={{ cursor: 'pointer' }}>
                  <div className={`card h-100`}>
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between">
                        <h5 className="card-title me-2">{searchingVehicles ? item.placa : item.nombre}</h5>
                        <img
                          className='imagen'
                          src={searchingVehicles ? item.fotoV : item.fotoP}
                          alt={`Sin foto`}
                          style={{ width: '90px', height: '90px', objectFit: 'cover' }}
                        />
                      </div>
                      <button className="btn btn-success mt-2" onClick={() => handleAddCard(item)}>Agregar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <br /><br />
          {showButtons && (
            <div className="d-flex mt-3" style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)' }}>
              <button className="btn btn-success mr-2" onClick={handleSave} disabled={isLoading || isLoadingHistorialPV}>
                {isLoading || isLoadingHistorialPV ? 'Guardando...' : 'Guardar'}
              </button>
              <button className="btn btn-danger" onClick={handleCancel}>Cancelar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Guardian;