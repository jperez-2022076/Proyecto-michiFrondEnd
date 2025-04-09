import { useState, useEffect } from "react";
import { listarVehiculoJson } from "../../../services/api";

export const useVehiculoDescargar = () => {
    const [vehiculos, setVehiculos] = useState(() => {
      const storedData = localStorage.getItem("vehiculos");
      return storedData ? JSON.parse(storedData) : []; 
    });
  
    const fetchvehiculos = async () => {
      try {
        const response = await listarVehiculoJson(); 
        if (response?.data) {
          setVehiculos(response.data);
          localStorage.setItem("vehiculos", JSON.stringify(response.data)); 
        }
      } catch (err) {
        console.error("Error al obtener vehiculos:", err);
      }
    };
  
    useEffect(() => {
      if (vehiculos.length === 0) {
        fetchvehiculos();
      }
    }, [vehiculos]); 
  
    return { vehiculos };
  };