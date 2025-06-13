import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header_User from './components/Header_User';
import Menu_Ppal from './components/Menu_Ppal';
import CrearCentro from './components/CrearCentro';
import ListarCentros from './components/ListarCentros';
import Register from './components/Register';
import ListarUsers from './components/ListarUsers';
import MapaContainer from './components/MapaContainer';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Index';
import Login from './components/Login';
import Mision from './components/Mision';
import Nosotros from './components/Nosotros';
import Vision from './components/Vision';


function App() {
  // Definir el estado del usuario
  const [user, setUser] = useState(null);
  // Definir el estado del drawer
  const [mobileOpen, setMobileOpen] = useState(false);
  const [centrosSalud, setCentrosSalud] = useState([]);
const apiUrl = import.meta.env.VITE_API_URL;
  useEffect(() => {
    // Verificar si hay datos de usuario en el almacenamiento local
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        // Intentar analizar los datos del usuario si existen en el almacenamiento local
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error al analizar los datos del usuario:', error);
        localStorage.removeItem('user'); // esta linea elimina datos corruptos
        setUser(null);
      }
    } else {
      setUser(null); // Si no hay datos, se asigna null para evitar errores
    }
  }, []);

  useEffect(() => {
  fetch(`${apiUrl}/api/urgencia`)
    .then((res) => res.json())
    .then((data) => {
      const urgencias = data.map(u => ({
        nombre: u.nombre || u.name_centro || "Sin nombre",
        latitud: parseFloat(u.latitud || u.latitude),
        longitud: parseFloat(u.longitud || u.longitude)
      })).filter(c => !isNaN(c.latitud) && !isNaN(c.longitud));

      setCentrosSalud(urgencias);
    })
    .catch((err) => console.error("Error al obtener centros de salud:", err));
}, []);



  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Router>
      <Routes>
        <Route path="/menu/*" element={
          <>
            <Header_User user={user || {}} handleDrawerToggle={handleDrawerToggle} />
            <Menu_Ppal user={user || {}} />
            <Footer />
          </>
        } />
        <Route path="/crearCentro/*" element={
          <>
            <Header_User user={user || {}} handleDrawerToggle={handleDrawerToggle} />
            <CrearCentro />
            <Footer />
          </>
        } />
        <Route path="/listarCentros/*" element={
          <>
            <Header_User user={user || {}} handleDrawerToggle={handleDrawerToggle} />
            <ListarCentros />
            <Footer />
          </>
        } />
        <Route path="/registro/*" element={
          <>
            <Header_User user={user || {}} handleDrawerToggle={handleDrawerToggle}/>
            <Register />
            <Footer />
          </>
        } />
        <Route path="/listarUsuarios/*" element={
          <>
            <Header_User user={user || {}} handleDrawerToggle={handleDrawerToggle} />
            <ListarUsers />
            <Footer />
          </>
        } />
        <Route path="/mapa" element={
          <>
            <Header />
            <MapaContainer centrosSalud={centrosSalud} />
            <Footer />
          </>
        } />
        <Route path="/*" element={
          <div style={{ paddingBottom: '60px' }}>
            <Header />
            <Routes>
              <Route index element={<Home />} />
              <Route path="nosotros" element={<Nosotros />} />
              <Route path="mision" element={<Mision />} />
              <Route path="vision" element={<Vision />} />
              <Route path="login" element={<Login setUser={setUser} />} />
            </Routes>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}
export default App;