import { useState } from "react";
import { eliminarVehiculos } from "../../../services/api";

const useEliminarVehiculo =()=>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const eliminarVehiculo = async(id,onDelete)=>{
        setLoading(true);
        setError(null);
        try {
            const response = await eliminarVehiculos(id)
            if (response.error) {
                setError(response.err);
                toast.error('Error al eliminar el vehiculo');
              } else {
                toast.success('Vehiculo eliminado exitosamente');
                if (onDelete) {
                  onDelete(); // Ejecutar callback de éxito
                }
              }
        } catch (err) {
            setError(err);
            toast.error('Ocurrió un error inesperado');
          } finally {
            setLoading(false);
          }
    }
    return {eliminarVehiculo, loading,error}
}
export default useEliminarVehiculo