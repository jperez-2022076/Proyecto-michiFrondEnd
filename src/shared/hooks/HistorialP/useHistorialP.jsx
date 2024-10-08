import { useState, useEffect } from 'react';
import { listarHistorialP } from '../../../services/api';


const useHistorialP = (fechaInicio, fechaFinal) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorialP = async () => {
      setLoading(true);
      setError(null);

      try {
        const fechas = { fechaInicio, fechaFinal };
        const response = await listarHistorialP(fechas);
            console.log(response)
        // Verificamos si hubo un error en la respuesta
        if (response.error) {
          throw new Error(response.err.message || 'Error al obtener el historial');
        }

        setData(response.data); // Ajusta según la estructura de respuesta de tu API
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (fechaInicio && fechaFinal) {
      fetchHistorialP();
    }
  }, [fechaInicio, fechaFinal]);

  return { data, loading, error };
};

export default useHistorialP;
