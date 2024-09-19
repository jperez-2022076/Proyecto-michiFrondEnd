
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Login } from './Pages/Login';
import { HomePage } from './Pages/HomePages/HomePages';

export const routes = [
    { path: "/", element: <Navigate to="/login" /> }, // Redirige desde la raíz a /login
    { path: "/login", element: <Login /> },
    {path: "/HomePage", element: <HomePage/>}
];
