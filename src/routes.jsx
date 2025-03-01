
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Login } from './Pages/Login';
import Table from './componentes/Table';
import Persona from './Pages/Persona/Persona'
import Vehiculos from './Pages/Vehiculos/Vehiculo';
import HistorialP from './Pages/Historial/HistorialP';
import HistorialPV from './Pages/Historial/HistorialPV';
import Guardian from './Pages/Guardian/Guardian';
import GuardianEscaner from './Pages/Guardian/GuardianEscaner';
import GuardianEscanerTelefono from './Pages/Guardian/GuardianEscanerT';

export const routes = [
    { path: "/", element: <Navigate to="/login" /> },
    { path: "/login", element: <Login /> },
    { path: "/Usuarios", element: <Table /> },
    {path:"/Personas",element:<Persona/>},
    {path:"/Vehiculos", element:<Vehiculos/>},
    {path:"/HistorialP",element:<HistorialP/>},
    {path:"/HistorialPV",element:<HistorialPV/>},
    {path:"/GuardianPorNombre",element:<Guardian/>},
    {path:"/Guardian",element:<GuardianEscaner/>},
    {path:"/GuardianTelefono",element:<GuardianEscanerTelefono/>}
  ];
  
