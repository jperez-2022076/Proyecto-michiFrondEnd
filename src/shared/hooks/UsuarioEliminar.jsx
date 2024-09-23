import { useState } from 'react';
import { eliminarUsuarios } from '../../services/api';
import { toast } from 'react-hot-toast';

const useEliminarUsuario = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const eliminarUsuario = async (id, onDelete) => {
    setLoading(true);
    setError(null);

    try {
      const response = await eliminarUsuarios(id);

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
  };

  return { eliminarUsuario, loading, error };
};

export default useEliminarUsuario;
