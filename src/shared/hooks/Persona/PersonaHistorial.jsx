import { useState } from "react";
import { listarHistorialPersona } from "../../../services/api";
import { toast } from 'react-hot-toast';

const useListarHistorialPersona = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [historial, setHistorial] = useState(null);

    const obtenerHistorialPersona = async (personaId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await listarHistorialPersona(personaId);

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

    return { obtenerHistorialPersona, loading, error, historial };
};

export default useListarHistorialPersona;
