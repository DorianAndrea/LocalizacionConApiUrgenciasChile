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

const Mapa = ({ latitude, longitude }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestCentro, setNearestCentro] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [distanceKm, setDistanceKm] = useState(null);
  const [centrosSalud, setCentrosSalud] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState("");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD4ZEmTaUkJj7cm5Ux7qYsuJ8mR0AeJMBg", 
    libraries: libraries,
    mapIds: ["7d9e6a68029b6674"], 
  });

  // Función para cargar centros de salud desde el backend
  const cargarCentrosSalud = async () => {
    try {
      setLoading(true);
      setDebugInfo("Iniciando carga de centros...");
      console.log("Cargando centros de salud...");
      
      // Verificar la URL completa
      const baseUrl = window.location.origin;
      const apiUrl = `${baseUrl}/api/urgencia`;
      console.log("URL del API:", apiUrl);
      setDebugInfo(`Intentando conectar a: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log("Status de respuesta:", response.status);
      console.log("Headers de respuesta:", response.headers);
      
      // Verificar el tipo de contenido antes de parsear
      const contentType = response.headers.get('content-type');
      console.log("Content-Type:", contentType);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      
      // Verificar si es JSON válido
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.log("Respuesta no es JSON, contenido:", textResponse.substring(0, 200));
        throw new Error(`El servidor devolvió ${contentType} en lugar de JSON. Respuesta: ${textResponse.substring(0, 100)}...`);
      }
      
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      // El backend ahora retorna un objeto con la propiedad 'centros'
      const centros = data.centros || data;
      
      if (!Array.isArray(centros)) {
        console.log("Datos recibidos:", centros);
        throw new Error("Los datos recibidos no son un array");
      }
      
      console.log(`Centros de salud cargados: ${centros.length}`);
      setCentrosSalud(centros);
      setError(null);
      setDebugInfo(`Centros cargados exitosamente: ${centros.length}`);
      
    } catch (err) {
      console.error("Error cargando centros de salud:", err);
      const errorMsg = `Error: ${err.message}`;
      setError(errorMsg);
      setDebugInfo(errorMsg);
      setCentrosSalud([]);
    } finally {
      setLoading(false);
    }
  };

  // También vamos a probar cargar directamente desde el archivo estático
  const cargarCentrosDesdeStatic = async () => {
    try {
      setDebugInfo("Intentando cargar desde archivo estático...");
      const response = await fetch('/static/establecimientos_salud_urgencias_chile.json');
      
      if (!response.ok) {
        throw new Error(`Error cargando archivo estático: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Datos cargados desde archivo estático:", data.length);
      
      // Procesar los datos igual que en el backend
      const centros = [];
      for (const item of data) {
        try {
          if (!item.LATITUD || !item.LONGITUD) continue;
          
          const centro = {
            nombre: item.NOMBRE || "Sin nombre",
            latitud: parseFloat(item.LATITUD),
            longitud: parseFloat(item.LONGITUD),
            tipo: item.TIPO || "",
            direccion: item.DIRECCION || "",
            telefono: item.FONO || "",
            region: item.REGION || "",
            comuna: item.COMUNA || ""
          };
          
          if (centro.latitud !== 0 && centro.longitud !== 0) {
            centros.push(centro);
          }
        } catch (e) {
          continue;
        }
      }
      
      setCentrosSalud(centros);
      setError(null);
      setDebugInfo(`Centros cargados desde archivo estático: ${centros.length}`);
      
    } catch (err) {
      console.error("Error cargando desde archivo estático:", err);
      setError(`Error cargando archivo estático: ${err.message}`);
    }
  };

  // Cargar centros al montar el componente
  useEffect(() => {
    // Primero intentar desde el API, si falla, intentar desde archivo estático
    cargarCentrosSalud().catch(() => {
      console.log("API falló, intentando archivo estático...");
      cargarCentrosDesdeStatic();
    });
  }, []);

  // Función para calcular la distancia entre dos puntos (Haversine formula)
  const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radio de la Tierra en km
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

    console.log("Inicializando mapa con", centrosSalud.length, "centros");

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

          let minDistance = Infinity;
          let nearest = null;
          let calculatedDistance = null;

          setUserLocation(userLatLng);
          googleMap.setCenter(userLatLng);
          console.log("Ubicación del usuario:", position.coords);

          // Buscar el centro más cercano
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
            console.log("Centro más cercano:", nearest);
            console.log("Distancia:", calculatedDistance);
            setNearestCentro(nearest);
            setDistanceKm(calculatedDistance);
            setOpenDialog(true);
          }

          // Marcador del usuario
          new window.google.maps.marker.AdvancedMarkerElement({
            map: googleMap,
            position: userLatLng,
            title: "Mi ubicación",
          });
        },
        (error) => {
          console.error("Error obteniendo la ubicación del usuario:", error);
          // Usar ubicación por defecto si no se puede obtener la del usuario
          const defaultLocation = { lat: parseFloat(latitude) || -33.4489, lng: parseFloat(longitude) || -70.6693 };
          googleMap.setCenter(defaultLocation);
        }
      );
    } else {
      console.error("Geolocalización no soportada por el navegador.");
    }

    // Agregar los marcadores de los centros de salud
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
        
        console.log(`Marcador ${index + 1} agregado:`, centro.nombre, lat, lng);
      } catch (err) {
        console.error(`Error agregando marcador para ${centro.nombre}:`, err);
      }
    });

    console.log("Mapa inicializado completamente");
  }, [isLoaded, loadError, latitude, longitude, centrosSalud]);

  if (loadError) return <div>Error al cargar Google Maps API: {loadError.message}</div>;
  if (!isLoaded) return <div>Cargando Google Maps...</div>;

  return (
    <>
      <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <div><strong>Estado:</strong> {loading ? 'Cargando...' : 'Completado'}</div>
        <div><strong>Centros cargados:</strong> {centrosSalud.length}</div>
        <div><strong>Debug:</strong> {debugInfo}</div>
        {error && <div style={{color: 'red'}}><strong>Error:</strong> {error}</div>}
      </div>
      
      <div ref={mapRef} style={{ width: "100%", height: "80vh" }} />

      {/* Ventana emergente con la distancia al centro más cercano */}
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