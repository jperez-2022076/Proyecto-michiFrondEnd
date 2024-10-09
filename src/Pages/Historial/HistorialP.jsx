import React, { useEffect, useState, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { toast, Toaster } from 'react-hot-toast';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO, addDays } from 'date-fns'; // Importa addDays
import { es } from 'date-fns/locale';
import '../../componentes/Table.css';
import Sidebar from '../../componentes/Sidebar';
import Navbar from '../../componentes/Navbar';
import { Dropdown } from 'react-bootstrap';
import { listarHistorialP } from '../../services/api';

// Registra la localización
registerLocale('es', es);

const HistorialP = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);

  const today = new Date();
  const [rangoFechas, setRangoFechas] = useState([today, today]);

  const [historialP, setHistorialP] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dataTableRef = useRef(null);
  const [fechaInicio, fechaFinal] = rangoFechas;

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const fetchHistorialP = async (fechas) => {
    setLoading(true);
    setError(null);

    try {
      const response = await listarHistorialP(fechas);
      if (response.error) {
        throw new Error(response.error.message || 'Error al obtener el historial');
      }
      setHistorialP(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fechaInicioFormateada = format(fechaInicio, 'yyyy-MM-dd');
    const fechaFinalFormateada = format(fechaFinal, 'yyyy-MM-dd');

    fetchHistorialP({ fechaInicio: fechaInicioFormateada, fechaFinal: fechaFinalFormateada });
  }, []);

  useEffect(() => {
    if (historialP.length > 0) {
      if ($.fn.dataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }
      $(dataTableRef.current).DataTable({
        language: {
          lengthMenu: 'Mostrar <span class="custom-select-container">_MENU_</span> cantidad de registros',
          info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
          infoFiltered: '(filtrado de _MAX_ registros en total)', 
          search: 'Buscar:',
        },
      });
    }
  }, [historialP]);

  const handleFechaChange = (dates) => {
    setRangoFechas(dates);
  };

  const enviarFechas = () => {
    if (fechaInicio && fechaFinal) {
      const fechaInicioFormateada = format(fechaInicio, 'yyyy-MM-dd');
      const fechaFinalFormateada = format(fechaFinal, 'yyyy-MM-dd');
      console.log('Fecha de Inicio:', fechaInicioFormateada);
      console.log('Fecha Final:', fechaFinalFormateada);

      if ($.fn.dataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }

      fetchHistorialP({ fechaInicio: fechaInicioFormateada, fechaFinal: fechaFinalFormateada });
    } else {
      console.log('Por favor selecciona un rango de fechas');
    }
  };

  return (
    <div id="wrapper" className={isSidebarVisible ? '' : 'toggled'}>
      <Toaster />
      <Sidebar isSidebarVisible={isSidebarVisible} />
      <div id="content-wrapper" className="d-flex flex-column">
        <Navbar toggleSidebar={toggleSidebar} />
        <div id="content">
          <div className="card shadow mb-4">
          <center>
                                <div className="card-header ">
                                 <h3>Historial Personas</h3>
                                </div>
                              
                            </center>
            <div className="py-3 d-flex justify-content-between align-items-center">
              <h6 className="m-0 font-weight-bold text-primary">Seleccionar Rango de Fechas</h6>
              <div className="dropdown">
                <Dropdown>
                  <Dropdown.Toggle variant="primary" id="dropdown-basic">
                    Exportar
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as="a"
                      href={`https://proyecto-michi.vercel.app/historialP/exportar/pdf/${fechaInicio}/${fechaFinal}`}
                      download
                    >
                      <FontAwesomeIcon icon={faFilePdf} className="mr-2" /> Exportar a PDF
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="a"
                      href={`https://proyecto-michi.vercel.app/historialP/exportar/excel/${fechaInicio}/${fechaFinal}`}
                      download
                    >
                      <FontAwesomeIcon icon={faFileExcel} className="mr-2" /> Exportar a Excel
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center">
                <DatePicker
                  locale="es"
                  selected={fechaInicio}
                  onChange={handleFechaChange}
                  startDate={fechaInicio}
                  endDate={fechaFinal}
                  selectsRange
                  dateFormat="yyyy-MM-dd"
                  placeholderText="Selecciona el rango de fechas"
                  className="form-control"
                  isClearable={true}
                  showPopperArrow={true}
                />

                <button className="btn btn-primary ml-3" onClick={enviarFechas}>
                  Mostrar registros
                </button>
              </div>

              {loading && <p>Cargando...</p>}
              {error && <p>No hay ningún registro en la fecha indicada.</p>}
              <br />
              <div className="table-responsive">
                <table ref={dataTableRef} className="table table-bordered" width="100%" cellSpacing="0">
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
                    {historialP.map((item, index) => (
                      <tr key={index}>
                        <td>{item.persona.nombre}</td>
                        <td>
                          {item.persona.fotoP !== 'Sin foto' ? (
                            <img
                              src={item.persona.fotoP}
                              alt="Foto de la persona"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          ) : (
                            'Sin foto'
                          )}
                        </td>
                        <td>{item.estado === 'E' ? 'Entró' : 'Salió'}</td>
                        <td>{item.usuario.nombre}</td>
                        <td>{format(parseISO(item.fecha), 'dd/MM/yyyy')}</td>
                        <td>{item.hora}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialP;
