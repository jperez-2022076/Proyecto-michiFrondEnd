import { useEffect, useState } from "react"
import { listaHistorialPV } from "../../../services/api"




const useHistorialPV = (fechaInicio,fechaFinal) =>{
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const [error,setError] =useState(null)

    useEffect(()=>{
        const fetchHistorialPV = async ()=>{
            setLoading(true)
            setError(null)

            try {
                const fechas = {fechaInicio,fechaFinal}
                const response = await listaHistorialPV(fechas)
                if (response.error) {
                    throw new Error(response.err.message || 'Error al obtener el historial');
                  }
                  setData(response.data)
            } catch (err) {
                setError(err.message);
              } finally {
                setLoading(false);
              }
        }
        if(fechaInicio && fechaFinal){
            fetchHistorialPV()
        }
    },[fechaInicio,fechaFinal])

    return {data,loading,error}
}

export default useHistorialPV