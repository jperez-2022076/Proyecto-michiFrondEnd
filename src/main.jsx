import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import $ from 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importa Bootstrap JavaScript
import 'bootstrap/dist/css/bootstrap.min.css'; // Importa los estilos de Bootstrap
import 'datatables.net-bs4'; // Importa DataTables con Bootstrap 4
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
window.jQuery = $; // Esto hace que jQuery esté disponible globalmente


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);