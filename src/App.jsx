import React, { useState } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { useRoutes } from 'react-router-dom';
import { routes } from './routes.jsx';
const App = () => {
  const element = useRoutes(routes);
  return (
    <>
      <ToastContainer />  {/* Asegúrate de que esté dentro del árbol de componentes */}
      {element}
    </>
  );
};

export default App;


