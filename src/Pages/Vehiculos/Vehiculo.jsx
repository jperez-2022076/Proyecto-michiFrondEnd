import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel, faTrash, faHistory, faEdit, faCoins } from '@fortawesome/free-solid-svg-icons';
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
import useListarHistorialVehiculo from '../../shared/hooks/Vehiculo/VehiculoHistorial';
import { format } from 'date-fns';
import moment from 'moment';


import { Dropdown } from 'react-bootstrap';

// Componente para agregar vehículo
const AgregarVehiculo = ({ onCancel, onSuccess }) => {
    const { agregarVehiculo } = useAgregarVehiculo();
    const [userData, setUserData] = useState({
        placa: '',
        codigo: '',
        fotoV: '',
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
            // Subir la imagen a Cloudinary si se ha seleccionado una
            let imagePublicId = '';
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'unsigned_preset');

                const response = await axios.post(
                    'https://api.cloudinary.com/v1_1/dmyubpur2/image/upload',
                    formData
                );

                const imageUrl = response.data.secure_url; // URL de la imagen subida

                // Extraer solo el public_id de la URL completa
                const imageParts = imageUrl.split('/');
                imagePublicId = `${imageParts[imageParts.length - 2]}/${imageParts[imageParts.length - 1]}`;
            }

            // Guardar los datos del vehículo y el public_id de la imagen (si existe)
            const updatedUserData = {
                ...userData,
                fotoV: imagePublicId || 'Sin foto',
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
                        maxLength={50}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="codigo">Código</label>
                    <input
                        type="text"
                        className="form-control"
                        id="codigo"
                        name="codigo"
                        value={userData.codigo}
                        onChange={handleChange}
                        maxLength={50}
                    />
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
        codigo: vehiculo.codigo || '',
        fotoV: vehiculo.fotoV || 'Sin foto',
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

                // Extraer solo el public_id de la URL
                const imageParts = imageUrl.split('/');
                const imagePublicId = `${imageParts[imageParts.length - 2]}/${imageParts[imageParts.length - 1]}`;

                updatedUserData = { ...updatedUserData, fotoV: imagePublicId }; // Actualizar solo la foto con el public_id
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
                        maxLength={50}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="codigo">Código</label>
                    <input
                        type="text"
                        className="form-control"
                        id="codigo"
                        name="codigo"
                        value={userData.codigo}
                        onChange={handleChange}
                        maxLength={50}
                    />
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

                <div className="form-group col-md-6">
                    <label htmlFor="fotoV">Foto actual del vehículo </label> <br />
                    <img
                        src={"https://res.cloudinary.com/dmyubpur2/image/upload/" + vehiculo.fotoV}
                        alt="Foto del vehículo"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
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
                        maxLength={50}
                    />
                </div>
                <div className="form-group col-md-6">
                    <label htmlFor="placa">Código</label>
                    <input
                        type="text"
                        className="form-control"
                        id="placa"
                        name="placa"
                        value={vehiculo.codigo}
                        required
                        disabled
                        maxLength={50}
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
            <div className="form-group col-md-6">

                <img
                    src={"https://res.cloudinary.com/dmyubpur2/image/upload/" + vehiculo.fotoV}
                    alt="Foto del vehículo"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
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


const HistorialVehiculo = ({ vehiculoId, onCancel }) => {
    const { obtenerHistorialVehiculo, loading, error, historial } = useListarHistorialVehiculo();
    const dataTableRef = useRef(null);
    const [fetchError, setFetchError] = useState(null); // Estado para manejar errores

    useEffect(() => {
        const fetchData = async () => {
            try {
                await obtenerHistorialVehiculo(vehiculoId);
                setFetchError(null); // Resetea el error si la llamada es exitosa
            } catch (err) {
                setFetchError(err.message || 'Error al obtener el historial'); // Maneja el error aquí
            }
        };
        fetchData();
    }, [vehiculoId]); // Dependencia en vehiculoId

    // Verifica si hay un error y muestra el mensaje
    if (fetchError) {
        return (
            <>
                <h5>Historial del vehículo</h5>
                <button className="btn btn-secondary mt-3" onClick={onCancel}>
                    Cerrar Historial
                </button>
                <br />
                <div className="card-body">
                    <p>Error: {fetchError}</p>
                </div>
            </>
        );
    }

    // Inicializar DataTable al obtener historial
    useEffect(() => {
        if (historial && historial.length > 0) {
            if ($.fn.dataTable.isDataTable(dataTableRef.current)) {
                $(dataTableRef.current).DataTable().destroy(); // Destruir instancia previa para evitar duplicados
            }
            $(dataTableRef.current).DataTable({
                language: {
                    lengthMenu: 'Mostrar <span class="custom-select-container">_MENU_</span> registros por página',
                    info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
                    infoFiltered: '(filtrado de _MAX_ registros en total)',
                    search: 'Buscar:',
                },
                order: [[7, 'desc'], [8, 'desc']], // Ordenar por fecha y hora
            });
        }
    }, [historial]);

    return (
        <>
            <h5>Historial del vehículo</h5>
            <button className="btn btn-secondary mt-3" onClick={onCancel}>
                Cerrar Historial
            </button>
            <br />
            <div className="card-body">
                {loading && <p>Cargando historial...</p>}
                {historial && historial.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-bordered" ref={dataTableRef} width="100%" cellSpacing="0">
                            <thead>
                                <tr>
                                    <th>Nombre de persona</th>
                                    <th>Foto de la persona</th>
                                    <th>Placa</th>
                                    <th>Código</th>
                                    <th>Foto Vehículo</th>
                                    <th>Estado</th>
                                    <th>Usuario</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historial.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.persona?.nombre || item.nombre}</td>
                                        <td>
                                            {item.persona?.fotoP ? (
                                                <img src={"https://res.cloudinary.com/dmyubpur2/image/upload/" + item.persona.fotoP} alt="Foto Persona" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                            ) : (
                                                'Invitado'
                                            )}
                                        </td>
                                        <td>{item.vehiculo?.placa || item.placa}</td>
                                        <td>{item.vehiculo.codigo ? item.vehiculo.codigo : "Sin código"}</td>
                                        <td>
                                            {item.vehiculo?.fotoV ? (
                                                <img src={"https://res.cloudinary.com/dmyubpur2/image/upload/" + item.vehiculo.fotoV} alt="Foto vehículo" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                                            ) : (
                                                'Invitado'
                                            )}
                                        </td>
                                        <td>
                                            {item.estado === 'E' ? 'Entrando' : item.estado === 'S' ? 'Saliendo' : 'Desconocido'}
                                        </td>
                                        <td>{item.usuario?.nombre}</td>
                                        <td>{format(new Date(new Date(item.fecha).toUTCString().slice(0, -3)), 'dd/MM/yyyy')}</td>

                                        <td>{item.hora}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No hay historial para el vehículo.</p> // Mensaje si no hay historiales
                )}
            </div>
        </>
    );
};

const ActualizarFechaPago = ({ vehiculo, onUpdate, onCancel }) => {
    const { actualizarVehiculo, loading } = useActualizarVehiculo();

    const [fechaPago, setFechaPago] = useState('');

    // Actualiza la fecha de pago inicial del vehículo o la fecha actual si no está disponible
    useEffect(() => {
        const fechaActual = new Date();
        const fechaFormateada = format(fechaActual, 'dd/MM/yyyy'); // Ajusta el formato según lo que prefieras
        setFechaPago(fechaFormateada);
    }, [vehiculo.fecha]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fechaActual = moment().format('YYYY-MM-DD');

            await actualizarVehiculo(vehiculo._id, { fecha: fechaActual, pagado: true }, onUpdate);
            toast.success('Fecha de pago actualizada correctamente');
            onUpdate();
        } catch (error) {
            console.error('Error actualizando la fecha de pago:', error);
            toast.error('Error actualizando la fecha de pago');
        }
    };

    return (
        <>

            <div className="modal-content">

                <h3>Confirmación de Pago</h3>
                {/* Mostrar la información de la placa y la foto */}
                <br />
                <center>
                    <div className="vehiculo-info">
                        <h5> <p><strong>Placa:</strong> {vehiculo.placa}</p></h5>
                        <h5> <p><strong>Código:</strong>{vehiculo.codigo ? vehiculo.codigo : "Sin código"}</p></h5>

                        <br />
                        <div className="vehiculo-foto">
                            <img
                                src={"https://res.cloudinary.com/dmyubpur2/image/upload/" + vehiculo.fotoV}
                                alt="Foto del vehículo"
                                style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <h5><label htmlFor="fechaPago">Fecha de Pago:</label></h5>
                        <h5>{fechaPago}</h5>
                    </div>
                </center>
                <br />
                <form onSubmit={handleSubmit}>

                    <div className="modal-footer">

                        <button type="submit" className="btn btn-primary">
                            Guardar
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>

        </>
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
                order: [[2, 'desc']], // 2 es el índice de la columna 'Pagado'
                language: {
                    lengthMenu: 'Mostrar <span class="custom-select-container">_MENU_</span> cantidad de registros',
                    info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
                    infoFiltered: '(filtrado de _MAX_ registros en total)',
                    search: 'Buscar:',
                    infoEmpty: 'Mostrando 0 a 0 de 0 registros',
                    zeroRecords: 'No se encontraron registros que coincidan',
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
                                {formMode === 'update-payment' && selectedVehiculo && (
                                    <ActualizarFechaPago
                                        vehiculo={selectedVehiculo}
                                        onUpdate={handleCancel}
                                        onCancel={handleCancel}
                                    />
                                )}


                                {formMode === 'delete' && selectedVehiculo && (
                                    <EliminarVehiculo vehiculo={selectedVehiculo} onDelete={handleDelete} onCancel={handleCancel} />
                                )}
                                {formMode === 'history' && selectedVehiculo && (
                                    <HistorialVehiculo vehiculoId={selectedVehiculo._id} onCancel={handleCancel} />
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
                                                    <th>Código</th>
                                                    <th>Foto</th>
                                                    <th>Pagado</th>
                                                    <th>Fecha de pago</th>
                                                    <th>Opciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {vehiculos.map((vehiculo, index) => (
                                                    <tr key={index}>
                                                        <td>{vehiculo.placa}</td>
                                                        <td>{vehiculo.codigo ? vehiculo.codigo : "Sin código"}</td>
                                                        <td>
                                                            {vehiculo.fotoV !== 'Sin foto' ? (
                                                                <img
                                                                    src={"https://res.cloudinary.com/dmyubpur2/image/upload/" + vehiculo.fotoV}
                                                                    alt="Foto del vehiculo"
                                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                />
                                                            ) : (
                                                                'Sin foto'
                                                            )}
                                                        </td>
                                                        <td>{vehiculo.pagado ? 'Pagado' : 'No pagado'}</td>
                                                        <td>
                                                            {vehiculo.fecha
                                                                ? format(new Date(new Date(vehiculo.fecha).toUTCString().slice(0, -3)), 'dd/MM/yyyy')
                                                                : 'No pagado'}
                                                        </td>

                                                        <td className="text-center">
                                                            <div className="dropdown">
                                                                <Dropdown>
                                                                    <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                                                        Opciones
                                                                    </Dropdown.Toggle>

                                                                    <Dropdown.Menu>
                                                                        <Dropdown.Item onClick={() => toggleForm('update-payment', vehiculo)}>
                                                                            <FontAwesomeIcon icon={faCoins} className="mr-2" /> Ingresar Pago
                                                                        </Dropdown.Item>

                                                                        <Dropdown.Item onClick={() => toggleForm('edit', vehiculo)}>
                                                                            <FontAwesomeIcon icon={faEdit} className="mr-2" /> Editar
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => toggleForm('delete', vehiculo)}>
                                                                            <FontAwesomeIcon icon={faTrash} className="mr-2" /> Eliminar
                                                                        </Dropdown.Item>
                                                                        <Dropdown.Item onClick={() => toggleForm('history', vehiculo)}>
                                                                            <FontAwesomeIcon icon={faHistory} className="mr-2" /> Historial
                                                                        </Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </div>
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
