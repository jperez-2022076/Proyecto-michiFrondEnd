import { useState, useEffect } from 'react';
import { buscarPersonaId } from "../../../services/api";

const useBuscarPersonaId = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // Agregar estado de éxito

  useEffect(() => {
    const fetchPersona = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await buscarPersonaId(id);
        if (response.error) {
          throw new Error(response.err.message);
        }
        setData(response.data);
        setIsSuccess(true); // Marca como éxito si se obtuvo una persona
      } catch (err) {
        setError(err.message || 'Error al buscar persona');
        setIsSuccess(false); // Marca como fracaso si hubo un error
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPersona();
    }
  }, [id]);

  return { data, loading, error, isSuccess }; // Retorna el estado de éxito
};

export default useBuscarPersonaId;
