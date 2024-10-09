import { useState, useEffect } from 'react';
import { buscarPersonaId } from "../../../services/api"; // Asegúrate de que la ruta de importación sea correcta

// Hook personalizado para buscar una persona por ID
const useBuscarPersonaId = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Función para buscar persona
    const fetchPersona = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await buscarPersonaId(id);
        if (response.error) {
          throw new Error(response.err.message);
        }
        setData(response.data); // Aquí asumes que el data está en response.data
      } catch (err) {
        setError(err.message || 'Error al buscar persona');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPersona();
    }
  }, [id]);

  return { data, loading, error };
};

export default useBuscarPersonaId;
