import React from "react";
import { useLocation } from "react-router-dom";
import Mapa from "./Mapa";

const MapaContainer = () => {
  const location = useLocation();
  const { latitude, longitude } = location.state || {};

  // Si latitude o longitude son undefined, establecer una ubicación por defecto (ej: centro de la ciudad)
  const lat = latitude ? parseFloat(latitude) : -33.0469; // Latitud de Valparaíso (por ejemplo)
  const lng = longitude ? parseFloat(longitude) : -71.6201; // Longitud de Valparaíso

  // Convertir las coordenadas de los centros de salud a números
  const centrosSalud = [
    { nombre: "SAPU Placilla", latitude: -33.11266727294424, longitude: -71.56624055092432 },
    { nombre: "SAPU Reina Isabel II", latitude: -33.057589174799425, longitude: -71.5927498664877 },
    { nombre: "SAPU Sector los Placeres", latitude: -33.04349082788096, longitude: -71.58300011157972 },
    { nombre: "SAPU Las Torres", latitude: -33.042770189912616, longitude: -71.53966175705291 },
    { nombre: "SAPU Alta Resolución", latitude: -33.04882785572625, longitude: -71.61652198519238 },
    { nombre: "SAPU Nueva Aurora", latitude: -33.04754301385855, longitude: -71.56461843580924 },
    { nombre: "SAPU Miraflores Alto", latitude: -33.02031827626386, longitude: -71.51563383580925 },
    { nombre: "SAPU Mena", latitude: -33.04882485826887, longitude: -71.63121109163166 },
    { nombre: "SAPU Quebrada Verde", latitude: -33.041746978835754, longitude: -71.64577177998689 },
    { nombre: "Servicio Urgencias Clínica Valparaíso", latitude: -33.04483637566131, longitude: -71.61119601349398 },
  ];

  return <Mapa latitude={lat} longitude={lng} centrosSalud={centrosSalud} />;
};

export default MapaContainer;
