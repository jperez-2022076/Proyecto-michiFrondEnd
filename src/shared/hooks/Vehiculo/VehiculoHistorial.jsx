import { useState } from "react";
import { listaHistorialVehiculo } from "../../../services/api";
import { toast } from 'react-hot-toast';

const useListarHistorialVehiculo = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [historial, setHistorial] = useState(null);

    const obtenerHistorialVehiculo = async (vehiculo) => {
        setLoading(true);
        setError(null);
        try {
            const response = await listaHistorialVehiculo(vehiculo);

            if (response.error) {
                setError(response.err);
               
            } else {
                setHistorial(response.data); // Asumiendo que la respuesta tiene una propiedad "data"
            
            }
        } catch (err) {
            setError(err);
            toast.error('Ocurrió un error inesperado');
        } finally {
            setLoading(false);
        }
    };

    return { obtenerHistorialVehiculo, loading, error, historial };
};

export default useListarHistorialVehiculo;
