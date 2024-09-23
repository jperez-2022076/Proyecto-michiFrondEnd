import { useState } from 'react';
import { agregarUsuarios } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const useAgregarUsuario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const agregarUsuario = async (userData, onSuccess) => {
    setLoading(true);
    setError(null);

    try {
      const response = await agregarUsuarios(userData);
      
      if (response.error) {
        setError(response.err);
        toast.error('Error al agregar usuario');
      } else {
        toast.success('Usuario agregado exitosamente');
        if (onSuccess) {
          onSuccess(); // Ejecutar callback de éxito
        }
      }
    } catch (err) {
      setError(err);
      toast.error('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return { agregarUsuario, loading, error };
};

export default useAgregarUsuario;



