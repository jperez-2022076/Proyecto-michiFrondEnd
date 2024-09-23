import React, { useState } from 'react';
import '../App.css';
import Input from '../componentes/Input';
import { useLogin } from '../shared/hooks/useLogin';
import { toast } from 'react-toastify';

export const Login = () => {
  const { login, isLoading } = useLogin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const clearFields = () => {
    setUsername('');
    setPassword('');
  };

  const handleLogin = async () => {
    const success = await login(username, password, clearFields);
    console.log(success)
    if (success) {
      toast.success("Acceso adquirido con éxito!");
    }else{
      toast.error("Usuario o Contraseña Incorrectos")
    }
  };

  return (
    <div className="bg-gradient-primary">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12 col-md-9">
            <div className="card o-hidden border-0 shadow-lg my-5">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
                  <div className="col-lg-6">
                    <div className="p-5">
                      <div className="text-center">
                        <h1 className="h4 text-gray-900 mb-4">¡Bienvenido de nuevo!</h1>
                      </div>
                      <form className="user" onSubmit={(e) => e.preventDefault()}>
                        <Input
                          type="text"
                          id="exampleInputEmail"
                          placeholder="Usuario"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                          type="password"
                          id="exampleInputPassword"
                          placeholder="Contraseña"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-primary btn-user btn-block w-100"
                          onClick={handleLogin}
                          disabled={isLoading}
                        >
                          {isLoading ? 'Cargando...' : 'Ingresar'}
                        </button>
                        <hr />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
