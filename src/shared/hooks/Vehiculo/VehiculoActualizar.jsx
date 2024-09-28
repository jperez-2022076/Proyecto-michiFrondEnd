import { useState } from "react";
import { actualizarVehiculos } from "../../../services/api";
import { toast } from 'react-hot-toast';

const useActualizarVehiculo = ()=>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const actualizarVehiculo = async(id,userData, onSuccess)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await actualizarVehiculos(id,userData)
            if (response.error) {
                setError(response.err);
                toast.error('Error al actualizar vehiculo');
              } else {
                toast.success('Vehiculo actualizado exitosamente');
                if (onSuccess) {
                  onSuccess(); // Ejecutar callback de éxito
                }
              }


        } catch  (err) {
            setError(err);
            toast.error('Ocurrió un error inesperado');
          } finally {
            setLoading(false);
          }
    }
    return {actualizarVehiculo,loading,error}
}
export default useActualizarVehiculo