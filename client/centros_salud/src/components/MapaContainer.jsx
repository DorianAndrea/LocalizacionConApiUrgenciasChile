import React from "react";
import { useLocation } from "react-router-dom";
import Mapa from "./Mapa";

const MapaContainer = () => {
  const location = useLocation();
  const { latitude, longitude } = location.state || {};

  const lat = latitude ? parseFloat(latitude) : -33.0469;
  const lng = longitude ? parseFloat(longitude) : -71.6201;

  // Ya no necesitamos pasar centrosSalud como prop porque 
  // el componente Mapa los carga directamente desde el backend
  return <Mapa latitude={lat} longitude={lng} />;
};

export default MapaContainer;