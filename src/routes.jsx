
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Login } from './Pages/Login';
import { HomePage } from './Pages/HomePages/HomePages';
import Table from './componentes/Table';
import Persona from './Pages/Persona/Persona'

export const routes = [
    { path: "/", element: <Navigate to="/login" /> },
    { path: "/login", element: <Login /> },
    { path: "/HomePage", element: <HomePage /> },
    { path: "/Usuarios", element: <Table /> },
    {path:"/Personas",element:<Persona/>}
  ];
  
