import { useState } from 'react';
import { actualizarUsuarios } from '../../services/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const useActualizarUsuario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const actualizarUsuario = async (id, userData, onSuccess) => {
    setLoading(true);
    setError(null);

    try {
      const response = await actualizarUsuarios(id, userData);
      
      if (response.error) {
        setError(response.err);
        toast.error('Error al actualizar usuario');
      } else {
        toast.success('Usuario actualizado exitosamente');
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

  return { actualizarUsuario, loading, error };
};

export default useActualizarUsuario;
