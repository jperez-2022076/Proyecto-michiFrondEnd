import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel, faTrash, faHistory, faEdit } from '@fortawesome/free-solid-svg-icons';
import InputMask from 'react-input-mask';
import { toast, Toaster } from 'react-hot-toast';
import './Table.css';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { listarUsuarios } from '../services/api';
import useAgregarUsuario from '../shared/hooks/User';
import useActualizarUsuario from '../shared/hooks/UsuarioActualiza';
import useEliminarUsuario from '../shared/hooks/UsuarioEliminar';

const AgregarUsuario = ({ onCancel, onSuccess }) => {
  const { agregarUsuario, loading } = useAgregarUsuario();

  const [userData, setUserData] = useState({
    usuario: '',
    nombre: '',
    telefono: '',
    password: '',
    rol: 'GUARDIAN'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    agregarUsuario(userData, onSuccess);
    onCancel()

  };

  return (
    <form onSubmit={handleSubmit}>
      <h5>Agregar Usuario</h5>
      {/* Form Fields */}
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="usuario">Usuario</label>
          <input type="text" className="form-control" id="usuario" name="usuario" value={userData.usuario} onChange={handleChange} required />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="nombre">Nombre</label>
          <input type="text" className="form-control" id="nombre" name="nombre" value={userData.nombre} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="telefono">Teléfono</label>
          <InputMask mask="+502 9999-9999" className="form-control" id="telefono" name="telefono" value={userData.telefono} onChange={handleChange} required />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="password">Contraseña</label>
          <input type="password" className="form-control" id="password" name="password" value={userData.password} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="rol">Rol</label>
        <select className="form-control" id="rol" name="rol" value={userData.rol} onChange={handleChange}>
          <option value={"GUARDIAN"}>Guardian</option>
          <option value={"ADMIN"} >Administrador</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}  >
        {loading ? 'Agregando...' : 'Agregar'}
      </button>
      <button type="button" className="btn btn-secondary ml-2" onClick={onCancel}>Cancelar</button>
    </form>
  );
};

const ActualizarUsuario = ({ user, onUpdate, onCancel }) => {
  const { actualizarUsuario, loading } = useActualizarUsuario();
  const [userData, setUserData] = useState({ ...user, password: '' }); // Inicializar password como cadena vacía

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUserData = { ...userData };

    // Si la contraseña está vacía, no se incluye en la actualización
    if (!userData.password) {
      delete updatedUserData.password;
    }

    actualizarUsuario(user._id, updatedUserData, onUpdate); 
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h5>Actualizar Usuario</h5>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="usuario">Usuario</label>
          <input
            type="text"
            className="form-control"
            id="usuario"
            name="usuario"
            value={userData.usuario}
            onChange={handleChange}
            required
          />
        </div>
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
      </div>
      <div className="form-row">
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
        <div className="form-group col-md-6">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={userData.password || ''} // Muestra la contraseña como vacía si es null
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="rol">Rol</label>
        <select
          className="form-control"
          id="rol"
          name="rol"
          value={userData.rol}
          onChange={handleChange}
        >
          <option value="GUARDIAN">Guardian</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Actualizando...' : 'Actualizar'}
      </button>
      <button
        type="button"
        className="btn btn-secondary ml-2"
        onClick={onCancel}
      >
        Cancelar
      </button>
    </form>
  );
};

const EliminarUsuario = ({ user, onDelete, onCancel }) => {
  const { eliminarUsuario, loading } = useEliminarUsuario();

  const handleDelete = () => {
    eliminarUsuario(user._id, onDelete);
    onCancel()
  };

  return (
    <form>
      <h5>Eliminar Usuario</h5>
      {/* Campos del formulario */}
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="usuario">Usuario</label>
          <input type="text" className="form-control" id="usuario" name="usuario" value={user.usuario} disabled />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="nombre">Nombre</label>
          <input type="text" className="form-control" id="nombre" name="nombre" value={user.nombre} disabled />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group col-md-6">
          <label htmlFor="telefono">Teléfono</label>
          <InputMask mask="+502 9999-9999" className="form-control" id="telefono" name="telefono" value={user.telefono} disabled />
        </div>
        <div className="form-group col-md-6">
          <label htmlFor="rol">Rol</label>
          <select className="form-control" id="rol" name="rol" value={user.rol} disabled>
            <option>{user.rol}</option>
            {/* Otros roles si necesitas */}
          </select>
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





const Table = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isFormVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState(null); // null, 'add', 'edit', 'delete'
  const [selectedUser, setSelectedUser] = useState(null);
  const dataTableRef = useRef(null);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const refreshUserList = () => {
    listarUsuarios()
      .then((response) => {
        setUsuarios(response.data.users);
    
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  };

  useEffect(() => {
    refreshUserList(); // Load users on component mount
  }, []);

  useEffect(() => {
    if (usuarios.length > 0) {
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
  }, [usuarios]);

  const handleAdd = (userData) => {
    agregarUsuario(userData, () => {
      setFormVisible(false);
      refreshUserList(); // Refresh the user list after adding
    }).catch((error) => {
      console.error('Error adding user:', error);
    });
  };

  const handleUpdate = (userData) => {
    console.log('Actualizar Usuario:', userData);
    // Call your API to update the user here
    setFormVisible(false);
    refreshUserList(); // Refresh the user list after updating
  };

  const handleDelete = (user) => {
    console.log('Eliminar Usuario:', user);
    // Call your API to delete the user here
    setFormVisible(false);
    refreshUserList(); // Refresh the user list after deleting
  };

  const toggleForm = (mode, user) => {
    setFormMode(mode);
    setSelectedUser(user);
    setFormVisible(true);
  };

  // New function for handling cancellation
  const handleCancel = () => {
    if ($.fn.dataTable.isDataTable(dataTableRef.current)) {
      $(dataTableRef.current).DataTable().destroy();
    }
    setFormVisible(false);
    refreshUserList(); // Refresh the user list when cancelling
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
                  <AgregarUsuario onSuccess={handleCancel} onCancel={handleCancel} />
                )}
                {formMode === 'edit' && selectedUser && (
                  <ActualizarUsuario user={selectedUser} onUpdate={handleUpdate} onCancel={handleCancel} />
                )}
                {formMode === 'delete' && selectedUser && (
                  <EliminarUsuario user={selectedUser} onDelete={handleDelete} onCancel={handleCancel} />
                )}
              </div>
            ) : (
              <>
                <div className="card-header py-3 d-flex justify-content-between align-items-center">
                  <button className="btn btn-primary" onClick={() => toggleForm('add')}>
                    Agregar
                  </button>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                  <table ref={dataTableRef} className="table table-bordered" width="100%" cellSpacing="0">
                      <thead>
                        <tr>
                          <th>Usuario</th>
                          <th>Nombre</th>
                          <th>Teléfono</th>
                          <th>Rol</th>
                          <th>Estado</th>
                          <th>Opciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usuarios.map((usuario, index) => (
                          <tr key={index}>
                            <td>{usuario.usuario}</td>
                            <td>{usuario.nombre}</td>
                            <td>{usuario.telefono}</td>
                            <td>{usuario.rol === 'ADMIN' ? 'Administrador' : 'Guardian'}</td>
                            <td>{usuario.estado ? 'Activo' : 'Inactivo'}</td>
                            <td className="text-center">
                              <button className="icon-wrapper icon-edit mr-2" onClick={() => toggleForm('edit', usuario)}>
                                <FontAwesomeIcon icon={faEdit} />
                              </button>
                              <button className="icon-wrapper icon-delete mr-2" onClick={() => toggleForm('delete', usuario)}>
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

export default Table;
