import axios from 'axios';


const apiClient = axios.create({
  baseURL: 'https://proyecto-michi.vercel.app',
  timeout: 5000,
});
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (err) => Promise.reject(err),
);

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


export const listarUsuarios = async () => {
  try {

    return await apiClient.get('https://proyecto-michi.vercel.app/usuario/listarUsuarios')

  } catch (err) {
    return {
      error: true,
      err,
    }
  }
}
export const agregarUsuarios = async (data) => {
  try {
    return await apiClient.post('https://proyecto-michi.vercel.app/usuario/addUser', data)
  } catch (err) {
    return {
      error: true,
      err,
    }
  }
}

export const actualizarUsuarios = async (id, data) => {
  try {
    return await apiClient.put(`https://proyecto-michi.vercel.app/usuario/updateUser/${id}`, data);

  } catch (err) {
    return {
      error: true,
      err,
    }
  }
}

export const eliminarUsuarios = async (id) => {
  try {
    return await apiClient.delete(`https://proyecto-michi.vercel.app/usuario/deleteUser/${id}`)
  } catch (err) {
    return {
      error: true,
      err,
    }
  }
}



export const listarPersonas = async () => {
  try {
    return await apiClient.get('https://proyecto-michi.vercel.app/persona/lista')
  } catch (err) {
    return {
      error: true,
      err
    }
  }
}
export const listarPersonasJson = async () => {
  try {
    return await apiClient.get('https://proyecto-michi.vercel.app/persona/descargarPersona')
  } catch (err) {
    return {
      error: true,
      err
    }
  }
}


export const agregarPersonaResquest  = async(data)=>{
  try {
     return await apiClient.post('https://proyecto-michi.vercel.app/persona/agregar', data)
  } catch (err) {
    return {
      error: true,
      err
    }
  }
}

export const actualizarPersonas = async (id,data) =>{
  try {
    return await apiClient.put(`https://proyecto-michi.vercel.app/persona/actualizar/${id}`, data)
  } catch (err) {
    return{
      error: true,
      err,
    }
  }
}


export const eliminarPersonas = async(id)=>{
  try {
    return await apiClient.delete(`https://proyecto-michi.vercel.app/persona/eliminar/${id}`)
  } catch (err) {
    return{
      error: true,
      err,
    }
  }
}
export const buscarPersonaNombre = async(nombre) =>{
  try {
    return await apiClient.post(`https://proyecto-michi.vercel.app/persona/buscar`,nombre)
  } catch (err) {
    return {
      error: true,
      err,
    }
  }
}

export const buscarPersonaId = async(id) =>{
  try {
    return await apiClient.get(`https://proyecto-michi.vercel.app/persona/buscarId/${id}`)
  } catch (err) {
    return {
      error: true,
      err,
    }
  }
}




export const listarVehiculo = async() =>{
  try {
    return await apiClient.get('https://proyecto-michi.vercel.app/vehiculo/lista')
  } catch (err) {
    return {
      error: true,
      err
    }
  }
}

export const listarVehiculoJson = async () => {
  try {
    return await apiClient.get('https://proyecto-michi.vercel.app/vehiculo/descargarVehiculo')
  } catch (err) {
    return {
      error: true,
      err
    }
  }
}

export const agregarVehiculoRequest =async (data)=>{
  try {
    return await apiClient.post('https://proyecto-michi.vercel.app/vehiculo/agregar', data)
 } catch (err) {
   return {
     error: true,
     err
   }
 }
}


export const actualizarVehiculos = async(id,data)=>{
  try {
    return await apiClient.put(`https://proyecto-michi.vercel.app/vehiculo/actualizar/${id}`, data)
  } catch (err) {
    return{
      error: true,
      err,
    }
  }
}

export const eliminarVehiculos = async(id)=>{
  try {
    return await apiClient.delete(`https://proyecto-michi.vercel.app/vehiculo/eliminar/${id}`)
  } catch (err) {
    return{
      error: true,
      err,
    }
  }
}

export const buscarVehiculoPlaca = async(placa) =>{
  try {
    return await apiClient.post(`https://proyecto-michi.vercel.app/vehiculo/buscar`,placa)
  } catch (err) {
    return {
      error: true,
      err,
    }
  }
}

export const buscarVehiculoId = async(id) =>{
  try {
    return await apiClient.get(`https://proyecto-michi.vercel.app/vehiculo/buscarId/${id}`)
  } catch (err) {
    return {
      error: true,
      err,
    }
  }
}


export const listarHistorialP = async(fechas) => {
  try {
    return await apiClient.post(`https://proyecto-michi.vercel.app/historialP/lista`, fechas)
  } catch (err) {
    return{
      error: true,
      err,
    }
  }  
}

export const listarHistorialPersona = async(personaId) => {
  try {
    const resultado = await apiClient.get(`https://proyecto-michi.vercel.app/historialP/buscarP/${personaId}`)
    console.log(resultado)
    return resultado
  } catch (err) {
    return{
      error: true,
      err,
    }
  }  
}

export const agregarHistorialP = async(data)=>{
  try {
    return await apiClient.post(`https://proyecto-michi.vercel.app/historialP/agregar`, data)
  } catch (err) {
    return {
      error: true,
      err
    }
  }
}



export const listaHistorialPV = async(fechas)=>{
  try {
    return await apiClient.post(`https://proyecto-michi.vercel.app/historialPV/listar`,fechas)
  } catch (err) {
    return {
      error: true,
      err,
    }
    
  }
}
export const listaHistorialVehiculo= async(vehiculo)=>{
  try {
    return await apiClient.get(`https://proyecto-michi.vercel.app/historialPV/buscarV/${vehiculo}`)
  } catch (err) {
    return {
      error: true,
      err,
    }
    
  }
}


export const agregarHistorialPV = async(data)=>{
  try {
    return await apiClient.post(`https://proyecto-michi.vercel.app/historialPV/agregar`,data)
  } catch (err) {
    return {
      error:true,
      err,
    }
  }
}


