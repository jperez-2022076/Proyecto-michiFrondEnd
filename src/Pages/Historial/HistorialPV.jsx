import React, { useEffect, useState, useRef } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { toast, Toaster } from 'react-hot-toast';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import '../../componentes/Table.css';
import Sidebar from '../../componentes/Sidebar';
import Navbar from '../../componentes/Navbar';
import { Dropdown } from 'react-bootstrap';
import { listaHistorialPV } from '../../services/api';

// Registra la localización
registerLocale('es', es);

const HistorialPV = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const today = new Date();
  const [rangoFechas, setRangoFechas] = useState([today, today]);
  const [historialPV, setHistorialPV] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dataTableRef = useRef(null);
  const [fechaInicio, fechaFinal] = rangoFechas;

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const fetchHistorialPV = async (fechas) => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await listaHistorialPV(fechas);
      if (response.error) {
        throw new Error(response.error.message || 'Error al obtener el historial');
      }
  
      // Ordenar historialPV por fecha y hora
      const sortedData = response.data.sort((a, b) => {
        const fechaA = new Date(a.fecha + 'T' + a.hora);
        const fechaB = new Date(b.fecha + 'T' + b.hora);
        return fechaA - fechaB; // Orden ascendente
      });
  
      setHistorialPV(sortedData);
    } catch (err) {
      if ($.fn.dataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }
      setHistorialPV([]); 
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fechaInicioFormateada = format(fechaInicio, 'yyyy-MM-dd');
    const fechaFinalFormateada = format(fechaFinal, 'yyyy-MM-dd');
    fetchHistorialPV({ fechaInicio: fechaInicioFormateada, fechaFinal: fechaFinalFormateada });
  }, []);

  useEffect(() => {
    if (historialPV.length > 0) {
      if ($.fn.dataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }
      $(dataTableRef.current).DataTable({
        language: {
          lengthMenu: 'Mostrar <span class="custom-select-container">_MENU_</span> cantidad de registros',
          info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
          infoFiltered: '(filtrado de _MAX_ registros en total)',
          search: 'Buscar:',
          infoEmpty: 'Mostrando 0 a 0 de 0 registros',
          zeroRecords: 'No se encontraron registros que coincidan',
        },
        order: [[8, 'desc'], [9, 'desc']], // Ordena por fecha (columna 6) y hora (columna 7) en orden descendente
      });
    }
  }, [historialPV]);

  const handleFechaChange = (dates) => {
    setRangoFechas(dates);
  };

  
  const enviarFechas = () => {
    if (fechaInicio && fechaFinal) {
      const fechaInicioFormateada = format(fechaInicio, 'yyyy-MM-dd');
      const fechaFinalFormateada = format(fechaFinal, 'yyyy-MM-dd');

      if ($.fn.dataTable.isDataTable(dataTableRef.current)) {
        $(dataTableRef.current).DataTable().destroy();
      }

      fetchHistorialPV({ fechaInicio: fechaInicioFormateada, fechaFinal: fechaFinalFormateada });
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
                <h3>Historial Vehículos</h3>
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
                      href={`https://proyecto-michi.vercel.app/historialPV/exportar/pdf/${format(fechaInicio, 'yyyy-MM-dd')}/${format(fechaFinal, 'yyyy-MM-dd')}`}
                      download
                    >
                      <FontAwesomeIcon icon={faFilePdf} className="mr-2" /> Exportar a PDF
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="a"
                      href={`https://proyecto-michi.vercel.app/historialPV/exportar/excel/${format(fechaInicio, 'yyyy-MM-dd')}/${format(fechaFinal, 'yyyy-MM-dd')}`}
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
                  className="form-control custom-datepicker" // Agrega la clase aquí
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
                      <th>DPI</th>
                      <th>Foto de la persona</th>
                      <th>Placa</th>
                      <th>Código</th>
                      <th>Foto Vehículo</th>
                      <th>Movimiento</th>
                      <th>Guardian</th>
                      <th>Fecha</th>
                      <th>Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historialPV.map((item, index) => (
                      <tr key={index}>
                        <td>{item.persona?.nombre || item.nombre}</td>
                        <td>{item.persona?.DPI || item.DPI}</td>
                        <td>
                          {item.persona?.fotoP ? (
                            <img src={"https://res.cloudinary.com/dmyubpur2/image/upload/"+item.persona.fotoP} alt="Foto Persona" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
                          ) : (
                            'Invitado'
                          )}
                        </td>
                        <td>{item.vehiculo?.placa || item.placa}</td>
                        <td>{item.vehiculo?.codigo ||"Cliente:"+ item.cliente || "Sin código"}</td>
                        <td>
                          {item.vehiculo?.fotoV ? (
                            <img src={"https://res.cloudinary.com/dmyubpur2/image/upload/"+item.vehiculo.fotoV} alt="Foto vehículo" style={{ width: '60px', height: '60px', objectFit: 'cover' }} />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorialPV;
