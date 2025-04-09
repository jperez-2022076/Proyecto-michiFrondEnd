import { useState, useEffect } from 'react';


const useBuscarVehiculoId = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); // Inicia como verdadero para cargar los datos
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // Agrega estado de éxito

  useEffect(() => {
    const fetchVehiculo = async () => {
      setLoading(true);
      setError(null);
      console.log("paso vvehiculo")
      try {
        const storedData = localStorage.getItem("vehiculos"); // Obtener datos de localStorage
        if (storedData) {
          const vehiculos = JSON.parse(storedData);
          const vehiculo = vehiculos.find(vehiculo => vehiculo._id === id); // Buscar el vehículo por id

          if (vehiculo) {
            setData(vehiculo);
            setIsSuccess(true); 
            setError(null);
          } else {
            setData(null); // Si no se encuentra, asegura que data sea null
            setIsSuccess(false);
            setError( 'Error al buscar vehículo');
            console.log("Error")
          }
        } else {
          setIsSuccess(false); // Si no hay datos en localStorage
        }
      } catch (err) {
        setError(err.message || 'Error al buscar vehículo');
        setIsSuccess(false); // Si ocurre un error, setea isSuccess a false
      } finally {
        setLoading(false); // Finaliza la carga
      }
    };

    if (id) {
      fetchVehiculo();
    } else {
      setLoading(false); // Si no hay id, termina el loading
    }
  }, [id]); // Se ejecuta cada vez que cambia el id

  return { data, loading, error, isSuccess }; // Retorna los datos, estado de carga, error y éxito
};

export default useBuscarVehiculoId;
