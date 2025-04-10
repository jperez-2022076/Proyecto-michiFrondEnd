import React, { useEffect, useState, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel, faTrash, faHistory, faEdit } from '@fortawesome/free-solid-svg-icons';
import { toast, Toaster } from 'react-hot-toast';
import '../../componentes/Table.css';
import Sidebar from '../../componentes/Sidebar';
import Navbar from '../../componentes/Navbar';
import { listarPersonas } from '../../services/api';
import useAgregarPersona from '../../shared/hooks/Persona/PersonaAgregar';
import InputMask from 'react-input-mask';
import axios from 'axios';
import useActualizarPersona from '../../shared/hooks/Persona/PersonaActualizar';
import useEliminarPersona from '../../shared/hooks/Persona/PersonaEliminar';
import useListarHistorialPersona from '../../shared/hooks/Persona/PersonaHistorial';
import { format } from 'date-fns';
import { Dropdown } from 'react-bootstrap';


const AgregarPersona = ({ onCancel, onSuccess }) => {
  const { agregarPersona } = useAgregarPersona();
  const [userData, setUserData] = useState({
    nombre: '',
    telefono: '',
    DPI: '',
    fotoP: '',
    cliente: ''
  });
  const [file, setFile] = useState(null); // Guardar el archivo seleccionado
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

    // Validar el número de teléfono
    const telefonoPattern = /^\+502 \d{4}-\d{4}$/;
    if (!telefonoPattern.test(userData.telefono)) {
        toast.error("Por favor, ingrese un número de teléfono válido en el formato +502 1234-5678.");
        return;
    }

    // Validar que el DPI solo contenga números y tenga entre 12 y 13 dígitos
    const dpiPattern = /^\d{12,13}$/;
    if (!dpiPattern.test(userData.DPI)) {
        toast.error("El DPI debe contener solo números y tener entre 12 y 13 dígitos.");
        return;
    }

    setLoading(true);

    try {
        let imageUrl = '';

        // Subir la imagen a Cloudinary si se selecciona una
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'unsigned_preset'); // Preset de Cloudinary

            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dmyubpur2/image/upload',
                formData
            );

            imageUrl = response.data.secure_url; // URL de la imagen subida

            // Extraer solo el public_id si es necesario
            const imageParts = imageUrl.split('/');
            const imagePublicId = `${imageParts[imageParts.length - 2]}/${imageParts[imageParts.length - 1]}`;

            imageUrl = imagePublicId; // Guardar solo el public_id en vez de la URL completa
        }

        // Guardar la URL de la imagen en los datos del usuario
        const updatedUserData = { ...userData, fotoP: imageUrl || 'Sin foto' };

        // Llamar al servicio que guarda los datos del usuario
        await agregarPersona(updatedUserData, onSuccess);

        setLoading(false);
        onCancel(); // Cerrar el formulario después de guardar
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        toast.error('Error al subir la imagen. Por favor, inténtalo de nuevo.');
          setLoading(false);
    }
};


  return (
    <form onSubmit={handleSubmit}>
      <h5>Agregar Persona</h5>
      {/* Campos del formulario */}
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="nombre">Nombre</label>
          <input
            maxLength={100}
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={userData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="telefono">Teléfono</label>
          <InputMask mask="+502 9999-9999" className="form-control" id="telefono" name="telefono"   inputMode="numeric" value={userData.telefono} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="DPI">DPI</label>
          <input
            type="text"
            className="form-control"
            id="DPI"
            name="DPI"
            value={userData.DPI}
            onChange={handleChange}
            required
              inputMode="numeric"
              maxLength={13}
           
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="nombre">Cliente</label>
          <input
            maxLength={100}
            type="text"
            className="form-control"
            id="cliente"
            name="cliente"
            value={userData.cliente}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group col-md-6">
          <label htmlFor="fotoP">Foto</label>
          <input type="file" className="form-control" onChange={handleFileChange}  />
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



const ActualizarPersona = ({ user, onUpdate, onCancel }) => {
  const { actualizarPersona } = useActualizarPersona();
  const [userData, setUserData] = useState({
    nombre: user.nombre || '',
    telefono: user.telefono || '',
    DPI: user.DPI || '',
    fotoP: user.fotoP || '',
    cliente: user.cliente || ''
  });
  const [loading, setLoading] = useState(false);
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

    // Validar el número de teléfono
    const telefonoPattern = /^\+502 \d{4}-\d{4}$/;
    if (!telefonoPattern.test(userData.telefono)) {
        toast.error("Por favor, ingrese un número de teléfono válido en el formato +502 1234-5678.");
        return;
    }

    // Validar que el DPI solo contenga números y tenga entre 12 y 13 dígitos
    const dpiPattern = /^\d{12,13}$/;
    if (!dpiPattern.test(userData.DPI)) {
        toast.error("El DPI debe contener solo números y tener entre 12 y 13 dígitos.");
        return;
    }
    setLoading(true);
    try {
        let updatedUserData = { ...userData };

        // Si hay una nueva foto, subirla a Cloudinary
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'unsigned_preset'); // Cambia esto a tu preset de Cloudinary

            const response = await axios.post(
                'https://api.cloudinary.com/v1_1/dmyubpur2/image/upload',
                formData
            );

            // Obtener el public_id en lugar de la URL completa
            const imageId = response.data.public_id;

            // Actualizar solo el public_id de la nueva foto en los datos del usuario
            updatedUserData = { ...updatedUserData, fotoP: imageId };
        }

        // Llamar al servicio que actualiza la persona
        await actualizarPersona(user._id, updatedUserData, onUpdate);
        setLoading(false);
    } catch (error) {
        console.error('Error al actualizar la persona:', error);
        toast.error('Error al actualizar la persona. Por favor, inténtalo de nuevo.');
        setLoading(false);
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <h5>Actualizar Persona</h5>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="nombre">Nombre</label>
          <input
          maxLength={100}
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={userData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="telefono">Teléfono</label>
          <InputMask
            mask="+502 9999-9999"
            className="form-control"
            id="telefono"
            name="telefono"
            value={userData.telefono}
            onChange={handleChange}
            required
              inputMode="numeric"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="DPI">DPI</label>
          <input
            type="text"
            className="form-control"
            id="DPI"
            name="DPI"
            value={userData.DPI}
            onChange={handleChange}
        maxLength={13}
            required
              inputMode="numeric"
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="nombre">Cliente</label>
          <input
            type="text"
            className="form-control"
            id="cliente"
            name="cliente"
            maxLength={100}
            value={userData.cliente}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="fotoP">Foto</label>
          <input type="file" className="form-control" onChange={handleFileChange} />
        </div>
      </div>
      <div className="form-group col-md-6">
                    <label htmlFor="fotoV">Foto actual de la persona </label> <br />
                    <img
                        src={"https://res.cloudinary.com/dmyubpur2/image/upload/" + userData.fotoP}
                        alt="Foto del vehículo"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                    />
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




const EliminarPersona = ({ user, onDelete, onCancel }) => {
  const { eliminarPersona, loading } = useEliminarPersona();
  const handleDelete = () => {
    eliminarPersona(user._id, onDelete);
    onCancel()
  };

  return (
    <form >
      <h5>Eliminar Persona</h5>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={user.nombre}

            required
            disabled
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="telefono">Teléfono</label>
          <InputMask
            mask="+502 9999-9999"
            className="form-control"
            id="telefono"
            name="telefono"
            value={user.telefono}

            required
            disabled
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="DPI">DPI</label>
          <input
            type="text"
            className="form-control"
            id="DPI"
            name="DPI"
            value={user.DPI}
            minLength={12}
            maxLength={13}
            required
            disabled
              inputMode="numeric"
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="nombre">Cliente</label>
          <input
            type="text"
            className="form-control"
            id="cliente"
            name="cliente"
            value={user.cliente}
            required
            disabled
          />
        </div>


        <div className="form-group col-md-6">

          <img src={"https://res.cloudinary.com/dmyubpur2/image/upload/"+user.fotoP} alt="Foto de la persona" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
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
const HistorialPersona = ({ personaId, onCancel }) => {
  const { obtenerHistorialPersona, loading, error, historial } = useListarHistorialPersona();
  const dataTableRef = useRef(null);
  const [fetchError, setFetchError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchData = async () => {
      try {
        await obtenerHistorialPersona(personaId);
        setFetchError(null); // Resetea el error si la llamada es exitosa
      } catch (err) {
        setFetchError(err.message || 'Error al obtener el historial'); // Maneja el error aquí
      }
    };
    fetchData();
  }, [personaId]); // Dependencia en personaId

  // Verifica si hay un error y muestra el mensaje
  if (fetchError) {
    return (
      <>
        <h5>Historial de la persona</h5>
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
        order: [[4, 'desc'], [5, 'desc']], // Ordenar por fecha y hora
      });
    }
  }, [historial]);

  return (
    <>
      <h5>Historial de la persona</h5>
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
                        <img src={"https://res.cloudinary.com/dmyubpur2/image/upload/"+item.persona.fotoP} alt="Foto Persona" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                      ) : (
                        'Invitado'
                      )}
                    </td>
                    <td>{item.estado === 'E' ? 'Entrando' : item.estado === 'S' ? 'Saliendo' : 'Desconocido'}</td>
                    <td>{item.usuario?.nombre}</td>
                    <td>{format(new Date(new Date(item.fecha).toUTCString().slice(0, -3)), 'dd/MM/yyyy')}</td>
                    <td>{item.hora}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No hay historial para la persona.</p> // Mensaje si no hay historiales
        )}
      </div>
    </>
  );
};


const Personas = () => {
  const [personas, setPersonas] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isFormVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState(null); // null, 'add', 'edit', 'delete', 'history'
  const [selectedPersona, setSelectedPersona] = useState(null);
  const dataTableRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const refreshPersonaList = () => {
    listarPersonas()
      .then((response) => {
        setPersonas(response.data);
        console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    refreshPersonaList();
  }, []);

  useEffect(() => {
    if (personas.length > 0) {
      if ($.fn.dataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }

      $(dataTableRef.current).DataTable({
        language: {
          lengthMenu: 'Mostrar <span class="custom-select-container">_MENU_</span> registros por página',
          info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
          infoFiltered: '(filtrado de _MAX_ registros en total)',
          search: 'Buscar:',
          infoEmpty: 'Mostrando 0 a 0 de 0 registros',
          zeroRecords: 'No se encontraron registros que coincidan',
        },
      });
    }
  }, [personas]);

  const handleCancel = () => {
    setFormVisible(false);
    refreshPersonaList();
  };

  const toggleForm = (mode, user) => {
    setFormMode(mode);
    setSelectedPersona(user);
    setFormVisible(true);
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
                {formMode === 'add' && <AgregarPersona onSuccess={handleCancel} onCancel={handleCancel} />}
                {formMode === 'edit' && selectedPersona && <ActualizarPersona user={selectedPersona} onUpdate={handleCancel} onCancel={handleCancel} />}
                {formMode === 'delete' && selectedPersona && <EliminarPersona user={selectedPersona} onDelete={handleCancel} onCancel={handleCancel} />}
                {formMode === 'history' && selectedPersona && <HistorialPersona personaId={selectedPersona._id} onCancel={handleCancel} />}
              </div>
            ) : (
              <>
                <center>
                  <div className="card-header ">
                    <h3>Personas</h3>
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
                          href="https://proyecto-michi.vercel.app/persona/exportar/pdf"
                          download // Esto indica que es un archivo para descargar
                        >
                          <FontAwesomeIcon icon={faFilePdf} className="mr-2" /> Exportar a PDF
                        </Dropdown.Item>
                        <Dropdown.Item
                          as="a"
                          href="https://proyecto-michi.vercel.app/persona/exportar/excel"
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
                    <table className="table table-bordered" ref={dataTableRef} width="100%" cellSpacing="0">
                    <thead>
                      <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Cliente</th>
                        <th style={{ textAlign: 'left' }}>DPI</th>
                        <th>Foto</th>
                        <th>Opciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {personas.map((persona, index) => (
                        <tr key={index}>
                          <td>{persona._id}</td>
                          <td>{persona.nombre}</td>
                          <td>{persona.telefono}</td>
                          <td>{persona.cliente ? persona.cliente : "Sin cliente"}</td>
                          <td style={{ textAlign: 'left' }}>{persona.DPI}</td>
                          <td>
                            {persona.fotoP !== 'Sin foto' ? (
                              <img
                                src={"https://res.cloudinary.com/dmyubpur2/image/upload/"+persona.fotoP}
                                alt="Foto de la persona"
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                              />
                            ) : (
                              'Sin foto'
                            )}
                          </td>
                            <td>
                              <div className="dropdown">
                                <Dropdown>
                                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                                    Opciones
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => toggleForm('edit', persona)}>
                                      <FontAwesomeIcon icon={faEdit} className="mr-2" /> Editar
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => toggleForm('delete', persona)}>
                                      <FontAwesomeIcon icon={faTrash} className="mr-2" /> Eliminar
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => toggleForm('history', persona)}>
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

export default Personas;
