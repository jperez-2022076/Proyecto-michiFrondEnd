import { useState } from "react";
import toast from "react-hot-toast";
import { agregarPersonaResquest } from "../../../services/api";



const useAgregarPersona = ()=>{
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const agregarPersona = async(userData, onSuccess)=>{
        setLoading(true)
        setError(null)
        try {
            const response = await agregarPersonaResquest(userData)
            if (response.error) {
                setError(response.err);
                toast.error('Error al agregar Persona');
              } else {
                toast.success('Persona agregado exitosamente');
                if (onSuccess) {
                  onSuccess(); // Ejecutar callback de éxito
                }
              }

        } catch (err) {
            console.log(err)
            setError(err)
            toast.error('Ocurrio un error inesperado al agregar Persona intenta de nuevo')
        }finally{
            setLoading(false)
        }
    }
    return {agregarPersona,loading,error}



}
export default useAgregarPersona