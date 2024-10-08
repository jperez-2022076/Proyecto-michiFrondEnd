import { useState } from 'react';
import toast from "react-hot-toast";
import { buscarVehiculoPlaca } from "../../../services/api";

const useBuscarVehiculoPlaca = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buscarVehiculo = async (placa) => {
    setLoading(true);
    setError(null);
    try {
      const response = await buscarVehiculoPlaca({ placa });

      if (response.error) {
        setError(response.err);
        toast.error('Error al buscar vehículo.');  // Mostrar toast de error
      } else {
        setVehiculos(response.data || []);
        if (response.data.length === 0) {
          toast.info('No se encontraron vehículos.');
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
    vehiculos,
    loading,
    error,
    buscarVehiculo,
  };
};

export default useBuscarVehiculoPlaca;
