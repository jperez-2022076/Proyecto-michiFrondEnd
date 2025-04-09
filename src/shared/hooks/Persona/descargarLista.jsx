import { useState, useEffect } from "react";
import { listarPersonasJson } from "../../../services/api"; // Asegúrate de importar tu cliente de API

export const usePersonasDescargar = () => {
    const [personas, setPersonas] = useState(() => {
      // Intenta obtener datos de localStorage al iniciar
      const storedData = localStorage.getItem("personas");
      return storedData ? JSON.parse(storedData) : []; // Si existen, los usamos, sino un arreglo vacío
    });
  
    const fetchPersonas = async () => {
      try {
        const response = await listarPersonasJson(); // Llamamos a tu función listarPersonasJson
        if (response?.data) {
          setPersonas(response.data);
          localStorage.setItem("personas", JSON.stringify(response.data)); // Guardamos los datos en localStorage
        }
      } catch (err) {
        console.error("Error al obtener personas:", err);
      }
    };
  
    useEffect(() => {

      if (personas.length === 0) {
        fetchPersonas();
      }
    }, [personas]); 
  
    return { personas };
  };