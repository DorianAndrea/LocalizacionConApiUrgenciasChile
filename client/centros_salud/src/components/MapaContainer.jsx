import React from "react";
import { useLocation } from "react-router-dom";
import Mapa from "./Mapa";

const MapaContainer = ({ centrosSalud }) =>  {
  const location = useLocation();
  const { latitude, longitude } = location.state || {};

  const lat = latitude ? parseFloat(latitude) : -33.0469;
  const lng = longitude ? parseFloat(longitude) : -71.6201;

 return (
    <Mapa 
      latitude={lat} 
      longitude={lng} 
      centrosSalud={centrosSalud} 
    />
  );
};

export default MapaContainer;