import { useState } from "react";
import { actualizarPersonas } from "../../../services/api";
import { toast } from 'react-hot-toast';

const useActualizarPersona = ()=>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const actualizarPersona = async (id,userData, onSuccess)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await actualizarPersonas(id, userData)

            if (response.error) {
                setError(response.err);
                toast.error('Error al actualizar usuario');
              } else {
                toast.success('Usuario actualizado exitosamente');
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
    return {actualizarPersona, loading,error}

}


export default useActualizarPersona