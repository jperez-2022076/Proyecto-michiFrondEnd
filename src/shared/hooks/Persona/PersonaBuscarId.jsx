import { useState, useEffect } from 'react';



const useBuscarPersonaId = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // Agregar estado de éxito

  useEffect(() => {
    const fetchPersona = async () => {
      setLoading(true);
      setError(null);

      try {
        const storedData = localStorage.getItem("personas");
        if (storedData) {
          const personas = JSON.parse(storedData);
          const persona = personas.find(persona => persona._id === id);

          if (persona) {
            setData(persona);
            setIsSuccess(true); 
            setError(null);
          } else {
            setData(null); // Si no se encuentra, se asegura que data sea null
            setIsSuccess(false);
            setError("Error al buscar persona")
          }
        } else {
          setIsSuccess(false); // Si no hay datos en localStorage
        }
      } catch (err) {
        setError(err.message || 'Error al buscar persona');
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPersona();
    } else {
      setLoading(false); // Si no hay id, simplemente termina el loading
    }
  }, [id]);
  return { data, loading, error, isSuccess }; // Retorna los estados, incluyendo isSuccess
};

export default useBuscarPersonaId;