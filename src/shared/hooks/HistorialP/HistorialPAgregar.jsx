// src/hooks/useAgregarHistorialP.js

import { useState } from 'react';
import { agregarHistorialP } from '../../../services/api'; // Ajusta la ruta según tu estructura
import toast from 'react-hot-toast';

export const useAgregarHistorialP = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addHistorial = async (data) => {
    setIsLoading(true);
    setError(null); // Limpia el error antes de hacer la solicitud

    const response = await agregarHistorialP(data);
    
    if (response.error) {
        toast.error('No se pudo agregar, intentalo de nuevo')
      setError(response.err); // Maneja el error si hay
    }else{
        toast.success('Agregado exitosamente')
    }

    setIsLoading(false);
    return response; // Devuelve la respuesta
  };

  return { addHistorial, isLoading, error };
};
