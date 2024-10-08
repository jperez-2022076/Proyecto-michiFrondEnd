import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel, faTrash, faHistory, faEdit } from '@fortawesome/free-solid-svg-icons';
import { toast, Toaster } from 'react-hot-toast';
import '../../componentes/Table.css';
import Sidebar from '../../componentes/Sidebar';
import Navbar from '../../componentes/Navbar';
import { listarVehiculo } from '../../services/api';
import useAgregarVehiculo from '../../shared/hooks/Vehiculo/VehiculoAgregar'
import InputMask from 'react-input-mask';
import axios from 'axios';
import useActualizarVehiculo from '../../shared/hooks/Vehiculo/VehiculoActualizar';
import useEliminarVehiculo from '../../shared/hooks/Vehiculo/VehiculoEliminar';


import { Dropdown } from 'react-bootstrap';

// Componente para agregar vehículo
const AgregarVehiculo = ({ onCancel, onSuccess }) => {
    const { agregarVehiculo } = useAgregarVehiculo();
    const [userData, setUserData] = useState({
        placa: '',
        fotoV: '',
        pagado: false,
        fecha: ''
    });
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            let fechaActual = '';

            // Asignar la fecha de hoy solo si está pagado
            if (userData.pagado) {
                fechaActual = new Date().toISOString(); // Guardamos la fecha en formato ISO
            }

            // Subir la imagen a Cloudinary si se ha seleccionado una
            let imageUrl = '';
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'unsigned_preset');

                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dmyubpur2/image/upload',
                    formData
                );

                imageUrl = response.data.secure_url; // URL de la imagen subida
            }

            // Guardar los datos del vehículo y la URL de la imagen (si existe)
            const updatedUserData = {
                ...userData,
                fotoV: imageUrl || 'Sin foto',
                fecha: fechaActual // Guardamos la fecha si pagado es true
            };

            await agregarVehiculo(updatedUserData, onSuccess);
            setLoading(false);
            onCancel(); // Cerrar el formulario después de guardar
        } catch (error) {
            console.error('Error al subir la imagen:', error);
            toast.error('Error al subir la imagen. Por favor, inténtalo de nuevo.'); // Mensaje de error
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5>Agregar Vehículo</h5>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="placa">Placa</label>
                    <input
                        type="text"
                        className="form-control"
                        id="placa"
                        name="placa"
                        value={userData.placa}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="pagado">Estado de Pago</label>
                    <select
                        className="form-control"
                        id="pagado"
                        name="pagado"
                        value={userData.pagado}
                        onChange={(e) => handleChange({ target: { name: 'pagado', value: e.target.value === 'true' } })} // Asegurarse de que el valor sea booleano
                        required
                    >
                        <option value={false}>No pagado</option>
                        <option value={true}>Pagado</option>
                    </select>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="fotoV">Foto del Vehículo</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Agregando...' : 'Agregar'}
            </button>
            <button type="button" className="btn btn-secondary ml-2" onClick={onCancel}>
                Cancelar
            </button>
        </form>
    );
};

// Componente para actualizar vehículo
const ActualizarVehiculo = ({ vehiculo, onUpdate, onCancel }) => {
    const { actualizarVehiculo, loading } = useActualizarVehiculo();
    const [userData, setUserData] = useState({
        placa: vehiculo.placa || '',
        fotoV: vehiculo.fotoV || 'Sin foto',
        pagado: vehiculo.pagado,
        fecha: vehiculo.fecha || ''
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let updatedUserData = { ...userData };
    
            // Asignar la fecha de hoy solo si está pagado
            if (userData.pagado) {
                updatedUserData.fecha = new Date().toISOString(); // Actualizar la fecha
            }
    
            // Si hay una nueva foto, subirla a Cloudinary
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'unsigned_preset');

                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dmyubpur2/image/upload',
                    formData
                );
                const imageUrl = response.data.secure_url;
                updatedUserData = { ...updatedUserData, fotoV: imageUrl }; // Actualizar solo la foto
            }
    
            // Llamada para actualizar el vehículo
            await actualizarVehiculo(vehiculo._id, updatedUserData, onUpdate);
        } catch (error) {
            console.error('Error al actualizar el vehículo:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h5>Actualizar Vehículo</h5>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="placa">Placa</label>
                    <input
                        type="text"
                        className="form-control"
                        id="placa"
                        name="placa"
                        value={userData.placa}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="pagado">Estado de Pago</label>
                    <select
                        className="form-control"
                        id="pagado"
                        name="pagado"
                        value={userData.pagado}
                        onChange={(e) => handleChange({ target: { name: 'pagado', value: e.target.value === 'true' } })} // Asegurarse de que el valor sea booleano
                        required
                    >
                        <option value={false}>No pagado</option>
                        <option value={true}>Pagado</option>
                    </select>
                </div>
            </div>
            <div className="form-row">
                <div className="form-group col-md-6">
                    <label htmlFor="fotoV">Foto del Vehículo</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
            <button type="button" className="btn btn-secondary ml-2" onClick={onCancel}>
                Cancelar
            </button>
        </form>
    );
};


const EliminarVehiculo = ({ vehiculo, onDelete, onCancel }) => {
    const { eliminarVehiculo, loading } = useEliminarVehiculo();
  
    const handleDelete = () => {
      eliminarVehiculo(vehiculo._id, onDelete);
  
      onCancel();
    };
  
    return (
      <form>
        <h5>Eliminar Vehículo</h5>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="placa">Placa</label>
            <input
              type="text"
              className="form-control"
              id="placa"
              name="placa"
              value={vehiculo.placa}
              required
              disabled
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="fotoV">Foto del Vehículo</label>
            <img
              src={vehiculo.fotoV !== 'Sin foto' ? vehiculo.fotoV : 'https://via.placeholder.com/100'}
              alt="Foto del vehículo"
              style={{ width: '100px', height: '100px', objectFit: 'cover' }}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="pagado">Estado de Pago</label>
            <input
              type="text"
              className="form-control"
              id="pagado"
              name="pagado"
              value={vehiculo.pagado ? 'Pagado' : 'No pagado'}
              required
              disabled
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="fecha">Fecha de Pago</label>
            <input
              type="text"
              className="form-control"
              id="fecha"
              name="fecha"
              value={vehiculo.fecha ? new Date(vehiculo.fecha).toLocaleDateString() : 'Sin fecha'}
              required
              disabled
            />
          </div>
        </div>
        <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
        <button type="button" className="btn btn-secondary ml-2" onClick={onCancel}>
          Cancelar
        </button>
      </form>
    );
  };





const Vehiculos = () => {
    const [vehiculos, setVehiculos] = useState([]);
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [isFormVisible, setFormVisible] = useState(false);
    const [formMode, setFormMode] = useState(null); // null, 'add', 'edit', 'delete'
    const [selectedVehiculo, setSelectedVehiculo] = useState(null);
    const dataTableRef = useRef(null);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const refreshVehiculoList = () => {
        listarVehiculo()
            .then((response) => {
                setVehiculos(response.data);

            })
            .catch((error) => {
                console.error('Error fetching users:', error);
            });
    };

    useEffect(() => {
        refreshVehiculoList(); // Load users on component mount
    }, []);

    useEffect(() => {
        if (vehiculos.length > 0) {
            if ($.fn.dataTable.isDataTable(dataTableRef.current)) {
                $(dataTableRef.current).DataTable().destroy();
            }

            $(dataTableRef.current).DataTable({
                language: {
                    lengthMenu: 'Mostrar <span class="custom-select-container">_MENU_</span> cantidad de registros',
                    info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
                    infoFiltered: '(filtrado de _MAX_ registros en total)', 
                    search: 'Buscar:',
                }
            });

        }
    }, [vehiculos]);

    const formatDate = (isoDate) => {
        if (!isoDate) {
            return ''; // Si no hay fecha, retornar vacío
        }
    
        const date = new Date(isoDate);
        
        // Si la fecha es inválida (como 1969), retornar vacío
        if (isNaN(date.getTime())) {
            return '';
        }
    
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Enero es 0
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };
    


    const handleDelete = (user) => {
        console.log('Eliminar Usuario:', user);
        // Call your API to delete the user here
        setFormVisible(false);
        refreshVehiculoList();
        handleCancel() 
    };

    const toggleForm = (mode, vehiculo) => {
        setFormMode(mode);
        setSelectedVehiculo(vehiculo); // Cambiado a setSelectedVehiculo
        setFormVisible(true);
    };

    // New function for handling cancellation
    const handleCancel = () => {
        if ($.fn.dataTable.isDataTable(dataTableRef.current)) {
            $(dataTableRef.current).DataTable().destroy();
        }
        setFormVisible(false);
        refreshVehiculoList(); // Refresh the user list when cancelling
    };

    return (
        <div id="wrapper" className={isSidebarVisible ? '' : 'toggled'}>
            <Toaster />
            <Sidebar isSidebarVisible={isSidebarVisible} />
            <div id="content-wrapper" className="d-flex flex-column">
                <Navbar toggleSidebar={toggleSidebar} />
                <div id="content">
                    <div className="card shadow mb-4">
                        {isFormVisible ? (
                            <div className="card-body">
                                {formMode === 'add' && (
                                    <AgregarVehiculo onSuccess={handleCancel} onCancel={handleCancel} />
                                )}
                                {formMode === 'edit' && selectedVehiculo && (
                                    <ActualizarVehiculo
                                        vehiculo={selectedVehiculo} // Cambiar "user" por "vehiculo"
                                        onUpdate={handleCancel}
                                        onCancel={handleCancel}
                                    />
                                )}


                                {formMode === 'delete' && selectedVehiculo && (
                                    <EliminarVehiculo    vehiculo={selectedVehiculo} onDelete={handleDelete} onCancel={handleCancel} />
                                )}
                            </div>
                        ) : (
                            <>
                            <center>
                                <div className="card-header ">
                                 <h3>Vehiculos</h3>
                                </div>
                              
                            </center>
                                <div className=" py-3 d-flex justify-content-between align-items-center">
                                    <button className="btn btn-primary" onClick={() => toggleForm('add')}>
                                        Agregar
                                    </button>
                                    <div className="dropdown">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                Exportar
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item
                                                    as="a"
                                                    href="https://proyecto-michi.vercel.app/vehiculo/exportar/pdf"
                                                    download // Esto indica que es un archivo para descargar
                                                >
                                                    <FontAwesomeIcon icon={faFilePdf} className="mr-2" /> Exportar a PDF
                                                </Dropdown.Item>
                                                <Dropdown.Item
                                                    as="a"
                                                    href="https://proyecto-michi.vercel.app/vehiculo/exportar/excel"
                                                    download // Esto indica que es un archivo para descargar
                                                >
                                                    <FontAwesomeIcon icon={faFileExcel} className="mr-2" /> Exportar a Excel
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table ref={dataTableRef} className="table table-bordered" width="100%" cellSpacing="0">
                                            <thead>
                                                <tr>
                                                    <th>Placa</th>
                                                    <th>Foto</th>
                                                    <th>Pagado</th>
                                                    <th>Fecha de pago</th>
                                                    <th>Estado</th>
                                                    <th>Opciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vehiculos.map((vehiculo, index) => (
                                                    <tr key={index}>
                                                        <td>{vehiculo.placa}</td>
                                                        <td>
                                                            {vehiculo.fotoV !== 'Sin foto' ? (
                                                                <img
                                                                    src={vehiculo.fotoV}
                                                                    alt="Foto del vehiculo"
                                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                />
                                                            ) : (
                                                                'Sin foto'
                                                            )}
                                                        </td>
                                                        <td>{vehiculo.pagado ? 'Pagado' : 'No pagado'}</td>
                                                        <td>{formatDate(vehiculo.fecha)}</td>
                                                        <td>{vehiculo.estado ? 'Activo' : 'Inactivo'}</td>
                                                        <td className="text-center">
                                                            <button className="icon-wrapper icon-edit mr-2" onClick={() => toggleForm('edit', vehiculo)}>
                                                                <FontAwesomeIcon icon={faEdit} />
                                                            </button>
                                                            <button className="icon-wrapper icon-delete mr-2" onClick={() => toggleForm('delete', vehiculo)}>
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                            <button className="icon-wrapper icon-history mr-2">
                                                                <FontAwesomeIcon icon={faHistory} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vehiculos;
