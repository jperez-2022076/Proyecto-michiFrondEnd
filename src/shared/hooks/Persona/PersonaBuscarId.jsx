import { useState, useEffect } from 'react';

const useBuscarPersonaId = (id, file) => {  // Recibimos el archivo personas como parámetro
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // Estado de éxito
  const [personas, setPersonas] = useState([]); // Almacenamos las personas cargadas desde el archivo

  useEffect(() => {
    const loadFile = () => {
      if (file && file.name === 'personas.json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target.result);
            setPersonas(jsonData); // Guardamos los datos del archivo JSON
          } catch (err) {
            setError('Error al leer el archivo JSON');
          }
        };
        reader.readAsText(file);
      } else {
        setError('Por favor, seleccione un archivo personas.json');
      }
    };

    if (file) {
      loadFile();
    }
  }, [file]); // Dependencia: se ejecuta cuando el archivo cambia

  useEffect(() => {
    const fetchPersona = () => {
      setLoading(true);
      setError(null);
      try {
        // Buscar persona en el JSON cargado
        const persona = personas.find((p) => p._id === id);

        if (persona) {
          setData(persona);
          setIsSuccess(true);  // Marca como éxito si la persona es encontrada
        } else {
          setError('Persona no encontrada');
          setIsSuccess(false);  // Marca como error si no se encuentra la persona
        }
      } catch (err) {
        setError(err.message || 'Error al buscar persona');
        setIsSuccess(false);
      } finally {
        setLoading(false);
      }
    };

    if (id && personas.length) {
      fetchPersona();  // Ejecutar la búsqueda cuando tenemos ID y personas cargadas
    }
  }, [id, personas]);  // Dependencias: id y personas (archivo JSON)

  return { data, loading, error, isSuccess };
};

export default useBuscarPersonaId;

