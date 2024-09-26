import { useState } from "react";
import { eliminarPersonas } from "../../../services/api";
import toast from "react-hot-toast";



const useEliminarPersona = () =>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const eliminarPersona = async(id, onDelete)=>{
        setLoading(true);
        setError(null);
        try {
            const response = await eliminarPersonas(id)
            if (response.error) {
                setError(response.err);
                toast.error('Error al eliminar el usuario');
              } else {
                toast.success('Usuario eliminado exitosamente');
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
    return {eliminarPersona, loading, error}
}

export default useEliminarPersona