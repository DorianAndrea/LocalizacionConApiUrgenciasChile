// Menu_Ppal.jsx
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header_User from './Header_User';
import Footer from './Footer';
import ListarCentros from './ListarCentros';
import Register from './Register';
import ListarUsers from './ListarUsers';
import CrearCentro from './CrearCentro';

const Menu_Ppal = ({ user }) => {
  return (
    <div>
      <Header_User user={user} />
      <Routes>
        <Route path="/crearCentro" element={<CrearCentro />} />
        <Route path="/listarCentros" element={<ListarCentros />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/listarUsuarios" element={<ListarUsers />} />
      </Routes>
      <Footer />
      <div>Hola, accede a las funcionalidades en el menú superior</div>
    </div>
  );
};

export default Menu_Ppal;