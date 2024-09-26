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
import { listarPersonas } from '../../services/api';
import useAgregarPersona from '../../shared/hooks/Persona/PersonaAgregar'
import InputMask from 'react-input-mask';
import axios from 'axios';
import useActualizarPersona from '../../shared/hooks/Persona/PersonaActualizar';
import useEliminarPersona from '../../shared/hooks/Persona/PersonaEliminar';
import { exportarPdf } from '../../services/api';
import { Dropdown } from 'react-bootstrap';


const AgregarPersona = ({ onCancel, onSuccess }) => {
  const { agregarPersona } = useAgregarPersona();
  const [userData, setUserData] = useState({
    nombre: '',
    telefono: '',
    DPI: '',
    fotoP: ''
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
    setLoading(true);

    try {
      // Subir la imagen a Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'unsigned_preset'); // Cambiado a tu upload preset

      const response = await axios.post(
        'https://api.cloudinary.com/v1_1/dmyubpur2/image/upload',
        formData
      );

      const imageUrl = response.data.secure_url; // URL de la imagen subida

      // Guardar la URL de la imagen en los datos del usuario
      const updatedUserData = { ...userData, fotoP: imageUrl };

      // Llamada al servicio que guarda los datos del usuario y la URL de la imagen en la base de datos
      await agregarPersona(updatedUserData, onSuccess);

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
      <h5>Agregar Persona</h5>
      {/* Campos del formulario */}
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="nombre">Nombre</label>
          <input
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
          <InputMask mask="+502 9999-9999" className="form-control" id="telefono" name="telefono" value={userData.telefono} onChange={handleChange} required />
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
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="fotoP">Foto</label>
          <input type="file" className="form-control" onChange={handleFileChange} required />
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
  const { actualizarPersona, loading } = useActualizarPersona();
  const [userData, setUserData] = useState({
    nombre: user.nombre || '',
    telefono: user.telefono || '',
    DPI: user.DPI || '',
    fotoP: user.fotoP || ''
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

      // Si hay una nueva foto, súbela a Cloudinary
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'unsigned_preset'); // Cambia esto a tu upload preset

        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dmyubpur2/image/upload',
          formData
        );
        const imageUrl = response.data.secure_url;
        updatedUserData = { ...userData, fotoP: imageUrl };
      }

      // Llamada para actualizar la persona
      await actualizarPersona(user._id, updatedUserData, onUpdate);

    } catch (error) {
      console.error('Error al actualizar la persona:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h5>Actualizar Persona</h5>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="nombre">Nombre</label>
          <input
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
            required
          />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="fotoP">Foto</label>
          <input type="file" className="form-control" onChange={handleFileChange} />
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

            required
            disabled
          />
        </div>
        <div className="form-group col-md-6">

          <img src={user.fotoP} alt="Foto de la persona" style={{ width: '100px', height: '100px' }} />
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


const Personas = () => {
  const [personas, setPersonas] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isFormVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState(null); // null, 'add', 'edit', 'delete'
  const [selectedPersona, setSelectedPersona] = useState(null);
  const dataTableRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const refreshPersonaList = () => {
    listarPersonas()
      .then((response) => {
        setPersonas(response.data);

      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    refreshPersonaList(); // Load users on component mount
  }, []);

  useEffect(() => {
    if (personas.length > 0) {
      if ($.fn.dataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }

      $(dataTableRef.current).DataTable({
        language: {
          lengthMenu: 'Mostrar <span class="custom-select-container">_MENU_</span> cantidad de registros',
          info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
        }
      });

    }
  }, [personas]);

  const handleDelete = (user) => {
    console.log('Eliminar Usuario:', user);
    // Call your API to delete the user here
    setFormVisible(false);
    refreshUserList(); // Refresh the user list after deleting
  };

  const toggleForm = (mode, user) => {
    setFormMode(mode);
    setSelectedPersona(user);
    setFormVisible(true);
  };

  // New function for handling cancellation
  const handleCancel = () => {
    if ($.fn.dataTable.isDataTable(dataTableRef.current)) {
      $(dataTableRef.current).DataTable().destroy();
    }
    setFormVisible(false);
    refreshPersonaList(); // Refresh the user list when cancelling
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
                  <AgregarPersona onSuccess={handleCancel} onCancel={handleCancel} />
                )}
                {formMode === 'edit' && selectedPersona && (
                  <ActualizarPersona
                    user={selectedPersona}
                    onUpdate={handleCancel}
                    onCancel={handleCancel}
                  />
                )}

                {formMode === 'delete' && selectedPersona && (
                  <EliminarPersona user={selectedPersona} onDelete={handleDelete} onCancel={handleCancel} />
                )}
              </div>
            ) : (
              <>
                <div className="card-header py-3 d-flex justify-content-between align-items-center">
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
                    <table ref={dataTableRef} className="table table-bordered" width="100%" cellSpacing="0">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Teléfono</th>
                          <th>DPI</th>
                          <th>Foto</th>
                          <th>Estado</th>
                          <th>Opciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {personas.map((persona, index) => (
                          <tr key={index}>
                            <td>{persona.nombre}</td>
                            <td>{persona.telefono}</td>
                            <td>{persona.DPI}</td>
                            <td>
                              {persona.fotoP !== 'Sin foto' ? (
                                <img src={persona.fotoP} alt="Foto de la persona" style={{ width: '50px', height: '50px' }} />
                              ) : (
                                'Sin foto'
                              )}
                            </td>
                            <td>{persona.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="text-center">
                              <button className="icon-wrapper icon-edit mr-2" onClick={() => toggleForm('edit', persona)}>
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button className="icon-wrapper icon-delete mr-2" onClick={() => toggleForm('delete', persona)}>
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

export default Personas;
