import React, { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

//Declaramos `libraries` fuera del componente
const libraries = ["places", "marker"];
const mapId = "7d9e6a68029b6674"; // Asegúrate de que este Map ID es válido

const Mapa = ({ latitude, longitude, centrosSalud }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestCentro, setNearestCentro] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [distanceKm, setDistanceKm] = useState(null); // Estado para almacenar la distancia

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD4ZEmTaUkJj7cm5Ux7qYsuJ8mR0AeJMBg", 
    libraries: libraries, // Usa la constante declarada arriba
    mapIds: ["7d9e6a68029b6674"], 

  });

  // 🔹 Función para calcular la distancia entre dos puntos (Haversine formula)
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Redondeamos a 2 decimales
  };

  useEffect(() => {
    if (loadError) {
      console.error("Error al cargar Google Maps API:", loadError);
      return;
    }
    if (!isLoaded || !window.google || !window.google.maps) {
      return;
    }

    const googleMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: parseFloat(latitude) || -33.4489, lng: parseFloat(longitude) || -70.6693 },
      zoom: 13,
      mapId: mapId,
    });

    setMap(googleMap);

    // Agregar marcador del usuario si tiene ubicación
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserLocation(userLatLng);
          googleMap.setCenter(userLatLng);

          new window.google.maps.marker.AdvancedMarkerElement({
            map: googleMap,
            position: userLatLng,
            title: "Tu ubicación",
          });

          let minDistance = Infinity;
          let nearest = null;
          let calculatedDistance = null;

          centrosSalud.forEach((centro) => {
            const distance = getDistanceKm(
              userLatLng.lat, userLatLng.lng,
              parseFloat(centro.latitude), parseFloat(centro.longitude)
            );

            if (parseFloat(distance) < minDistance) {
              minDistance = parseFloat(distance);
              nearest = centro;
              calculatedDistance = distance;
            }
          });

          if (nearest) {
            setNearestCentro(nearest);
            setDistanceKm(calculatedDistance); // Guardamos la distancia calculada
            setOpenDialog(true);
          }
        },
        () => console.error("Error obteniendo la ubicación del usuario")
      );
    } else {
      console.error("Geolocalización no soportada por el navegador.");
    }

    // Agregar los marcadores de los centros de salud
    centrosSalud.forEach((centro) => {
      new window.google.maps.marker.AdvancedMarkerElement({
        map: googleMap,
        position: { lat: parseFloat(centro.latitude), lng: parseFloat(centro.longitude) },
        title: centro.nombre,
      });
    });
  }, [isLoaded, loadError, latitude, longitude, centrosSalud]);

  if (loadError) return <div>⚠️ Error al cargar Google Maps API</div>;
  if (!isLoaded) return <div>⏳ Cargando mapa...</div>;

  return (
    <>
      <div ref={mapRef} style={{ width: "100%", height: "90vh" }} />

      {/*Ventana emergente con la distancia al centro más cercano */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Centro de Urgencia Más Cercano</DialogTitle>
        <DialogContent>
          <DialogContentText>
            El centro de salud más cercano es:  
            <strong> {nearestCentro?.nombre} </strong>  
            <br />
            Se encuentra a <strong>{distanceKm} km</strong> de tu ubicación.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">Cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Mapa;
