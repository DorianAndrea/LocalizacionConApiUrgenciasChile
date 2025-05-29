import React, { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

// Declaramos `libraries` fuera del componente
const libraries = ["places", "marker"];
const mapId = "7d9e6a68029b6674";

const Mapa = ({ latitude, longitude, centrosSalud }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestCentro, setNearestCentro] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [distanceKm, setDistanceKm] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD4ZEmTaUkJj7cm5Ux7qYsuJ8mR0AeJMBg",
    libraries: libraries,
    mapIds: [mapId],
  });

  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  useEffect(() => {
    if (loadError) {
      console.error("Error al cargar Google Maps API:", loadError);
      return;
    }

    if (!isLoaded || !window.google || !window.google.maps || centrosSalud.length === 0) {
      return;
    }

    const googleMap = new window.google.maps.Map(mapRef.current, {
      center: { lat: parseFloat(latitude) || -33.4489, lng: parseFloat(longitude) || -70.6693 },
      zoom: 13,
      mapId: mapId,
    });

    setMap(googleMap);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          let minDistance = Infinity;
          let nearest = null;
          let calculatedDistance = null;

          setUserLocation(userLatLng);
          googleMap.setCenter(userLatLng);

          centrosSalud.forEach((centro) => {
            const distance = getDistanceKm(
              userLatLng.lat, userLatLng.lng,
              parseFloat(centro.latitud), parseFloat(centro.longitud)
            );

            if (parseFloat(distance) < minDistance) {
              minDistance = parseFloat(distance);
              nearest = centro;
              calculatedDistance = distance;
            }
          });

          if (nearest) {
            setNearestCentro(nearest);
            setDistanceKm(calculatedDistance);
            setOpenDialog(true);
          }

          new window.google.maps.marker.AdvancedMarkerElement({
            map: googleMap,
            position: userLatLng,
            title: "Mi ubicación",
          });
        },
        (error) => {
          console.error("Error obteniendo la ubicación del usuario:", error);
          const defaultLocation = { lat: parseFloat(latitude) || -33.4489, lng: parseFloat(longitude) || -70.6693 };
          googleMap.setCenter(defaultLocation);
        }
      );
    } else {
      console.error("Geolocalización no soportada por el navegador.");
    }

    centrosSalud.forEach((centro, index) => {
      try {
        const lat = parseFloat(centro.latitud);
        const lng = parseFloat(centro.longitud);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn(`Centro ${centro.nombre} tiene coordenadas inválidas:`, centro);
          return;
        }

        new window.google.maps.marker.AdvancedMarkerElement({
          map: googleMap,
          position: { lat, lng },
          title: centro.nombre,
        });

      } catch (err) {
        console.error(`Error agregando marcador para ${centro.nombre}:`, err);
      }
    });

  }, [isLoaded, loadError, latitude, longitude, centrosSalud]);

  if (loadError) return <div>Error al cargar Google Maps API: {loadError.message}</div>;
  if (!isLoaded) return <div>Cargando Google Maps...</div>;

  return (
    <>
      <div ref={mapRef} style={{ width: "100%", height: "80vh" }} />

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Centro de Urgencia Más Cercano</DialogTitle>
        <DialogContent>
          <DialogContentText>
            El centro de salud más cercano es:
            <br />
            <strong>{nearestCentro?.nombre}</strong>
            <br />
            <strong>Tipo:</strong> {nearestCentro?.tipo}
            <br />
            <strong>Dirección:</strong> {nearestCentro?.direccion}
            <br />
            <strong>Distancia:</strong> {distanceKm} km de tu ubicación
            {nearestCentro?.telefono && (
              <>
                <br />
                <strong>Teléfono:</strong> {nearestCentro.telefono}
              </>
            )}
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
