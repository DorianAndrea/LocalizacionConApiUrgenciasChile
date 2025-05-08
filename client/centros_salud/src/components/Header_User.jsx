// PaginaPrincipal.jsx
import React, { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Footer from './Footer';
import ListarCentros from './ListarCentros';
import Dialog  from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const drawerWidth = 240;

const PaginaPrincipal = ({ window, user }) => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false) // estado que controla el cuadro de dialogo
    const navigate = useNavigate();

    const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
};

    const handleLogout = () => {
      //abre el cuadro de dialogo para confirmar 
        setLogoutDialogOpen(true);
        
    };
    const confirmLogout = () =>{
      setLogoutDialogOpen(false);
      navigate('/'); // cierra sesion y redirige a la pagina ppal
    }
    const cancelLogout = () =>{
      setLogoutDialogOpen(false);
    }

    const handleList = () => {
        // Lógica para cerrar sesión
            navigate('/listarCentros/*');
        };
    
    const handleRegistro = () => {
        // Lógica para cerrar sesión
            navigate('/registro');
          };
    const handleListUsers = () => {
        // Lógica para cerrar sesión
        navigate('/listarUsuarios');
    };

    const handleCreateCentro = () => {
        // Lógica para cerrar sesión
        navigate('/crearCentro');
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Menú
            </Typography>
            <Divider />
            <List>
            <ListItem key="Listar Centros" disablePadding>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                {user ? `Bienvenido, ${user.first_name}` : 'Bienvenido'}
              </Typography>
              <ListItemButton sx={{ textAlign: 'center' }} component={Link} 
                to="/crearCentro">
                  <ListItemText primary="Crear Centro" />
              </ListItemButton>
      
              <ListItemButton sx={{ textAlign: 'center' }} component={Link} 
                to="/listarCentros">
                  <ListItemText primary="Listar Centros" />
              </ListItemButton>
              <ListItemButton sx={{ textAlign: 'center' }} component={Link} 
                to="/register">
                  <ListItemText primary="Crear Usuarios d" />
              </ListItemButton>
              <ListItemButton sx={{ textAlign: 'center' }} component={Link} 
                to="/listarUsers">
                  <ListItemText primary="Crear Usuarios d" />
              </ListItemButton>
            </ListItem>
            {/* Agrega más opciones de menú aquí */}
        </List>
        </Box>
);

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: '#9900ff' }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Bienvenido {user.first_name}
          </Typography>
          <Button color="inherit" onClick={handleCreateCentro}>
            Crear Centro
          </Button>
          <Button color="inherit" onClick={handleList}>
            Listar Centros
          </Button>
          <Button color="inherit" onClick={handleRegistro}>
            Nuevo Usuario
          </Button>
          <Button color="inherit" onClick={handleListUsers}>
            Lista Usuarios
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="/listarCentros" element={<ListarCentros />} />
          {/* Agrega más rutas para otras opciones de menú */}
        </Routes>
      </Box>
      <Footer />
      <Dialog open={logoutDialogOpen} onClose={cancelLogout}>
        <DialogTitle>Confirmar Cierre de Sesión</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Estas seguro de cerrar sesión?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout} color="primary">Cancelar</Button>
          <Button onClick={confirmLogout} color="secondary">Cerrar Sesión</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
<ListarCentros/>
PaginaPrincipal.propTypes = {
    window: PropTypes.func,
    user: PropTypes.object.isRequired,
};

export default PaginaPrincipal;