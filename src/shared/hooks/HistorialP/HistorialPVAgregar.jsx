import { useState } from "react";
import { agregarHistorialPV } from "../../../services/api";
import toast from "react-hot-toast";


export const useAgregarHistorialPV =()=>{
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const addHistorialPV = async(data)=>{
        setIsLoading(true);
        setError(null); // Limpia el error antes de hacer la solicitud

        const response  = await agregarHistorialPV(data)

        if(response.error){
            toast.error('No se pudo agregar, intentalo de nuevo')
            setError(response.err)
            console.log(response.err)
        }

        setIsLoading(false)
        return response
    }
    return {addHistorialPV,isLoading, error}

}