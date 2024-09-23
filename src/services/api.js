import axios from 'axios';
import { error } from 'jquery';

const apiClient = axios.create({
  baseURL: 'https://proyecto-michi.vercel.app',
  timeout: 5000,
});

export const loginRequest = async (data) => {
    try {
      return await apiClient.post('https://proyecto-michi.vercel.app/usuario/login', data);
    } catch (err) {
      return {
        error: true,
        err,
      };
    }
  };


export const listarUsuarios = async()=>{
  try {
  
    return await apiClient.get('https://proyecto-michi.vercel.app/usuario/listarUsuarios')
 
  } catch (err) {
    return{
      error:true,
      err,
    }
  }
}
export const agregarUsuarios = async(data)=>{
  try {
    return await apiClient.post('https://proyecto-michi.vercel.app/usuario/addUser',data)
  } catch (err) {
    return{
      error:true,
      err,
    }
  }
}

export const actualizarUsuarios = async(id,data)=>{
  try {
    return await apiClient.put(`https://proyecto-michi.vercel.app/usuario/updateUser/${id}`, data);

  } catch (err) {
    return {
      error: true,
      err,
    }
  }
}

export const eliminarUsuarios = async(id)=>{
  try {
    return await apiClient.delete(`https://proyecto-michi.vercel.app/usuario/deleteUser/${id}`)
  } catch (err) {
    return{
      error:true,
      err,
    }
  }
}

