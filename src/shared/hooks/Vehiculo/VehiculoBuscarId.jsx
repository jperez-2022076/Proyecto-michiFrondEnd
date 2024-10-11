import { useState, useEffect } from 'react';
import { buscarVehiculoId } from "../../../services/api";

const useBuscarVehiculoId = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return; // Si no hay id, no hacemos nada
      setLoading(true);
      setError(null); // Reinicia el error al hacer una nueva solicitud

      try {
        const response = await buscarVehiculoId(id);
        if (response.error) {
          throw new Error(response.err || 'Error al buscar vehículo');
        }
        setData(response.data); // Asigna los datos recibidos
      } catch (err) {
        setError(err.message); // Maneja el error
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    fetchData();
  }, [id]); // Efecto que se ejecuta cuando cambia el id

  return { data, loading, error }; // Retorna los datos, estado de carga y error
};

export default useBuscarVehiculoId;
