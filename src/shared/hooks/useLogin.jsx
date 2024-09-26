import { useState } from 'react';
import { loginRequest } from '../../services/api.js';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
 // Asegúrate de importar jwtDecode

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (usuario, password, clearFields) => {
    setIsLoading(true);
    const user = { usuario, password };
    let success = false;
    try {
      const response = await loginRequest(user);
      setIsLoading(false);

      if (response.error) {
        toast.error(
          response?.err?.response?.data.message || 'Error general al intentar logearse. Intenta de nuevo.'
        );
      } else if (response.data) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        toast.success(`Bienvenido`);
        navigate('/Personas');
        success = true;
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 404) {
        toast.error('Usuario no encontrado.');
      } else {
        toast.error('Error al intentar iniciar sesión. Intenta de nuevo.');
      }
    } finally {
      clearFields(); // Limpia los campos después del intento de inicio de sesión
    }
    return success;
  };

  return { login, isLoading };
};
