import toast from "react-hot-toast";
import { useState } from 'react';
import { buscarPersonaNombre } from "../../../services/api";

const useBuscarPersonaNombre = () => {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarPersona = async (nombre) => {
    setLoading(true);
    setError(null);
    try {
      const response = await buscarPersonaNombre({ nombre });

      if (response.error) {
        setError(response.err);
        toast.error('Error al buscar persona.');  // Mostrar toast de error
      } else {
        setPersonas(response.data || []);
        if (response.data.length === 0) {
          toast('No se encontraron personas.');
        }
      }
    } catch (err) {
      setError(err.message);
      toast.error('Error en la búsqueda.');  // Mostrar toast si hay error en la solicitud
    } finally {
      setLoading(false);
    }
  };

  return {
    personas,
    loading,
    error,
    buscarPersona,
  };
};

export default useBuscarPersonaNombre;
