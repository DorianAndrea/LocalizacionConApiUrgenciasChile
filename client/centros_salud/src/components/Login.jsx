import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ListarCentros from './ListarCentros';

const Login = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showListarCentros, setShowListarCentros] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //validar que los campos no esten vacios
    if(!email || !password){
      setError('**Ingresa un email y contraseña');
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Correo electrónico no válido');
      return;
    }

    // Validar longitud de la contraseña
    if (password.length < 7) {
      setError('La contraseña debe tener al menos 7 caracteres');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:5173/api/login', { 
        email,
        password,
      });
      if (response.data.message === 'Inicio de sesión exitoso') {
        console.log('Inicio de sesión exitoso', response.data);
        // Usa props.setUser en lugar de setUser
        props.setUser(response.data.user); 
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate('/menu');
        
      } else if (response.data.error) {
        console.log('Error al iniciar sesión:', response.data.error);
        setError(response.data.error);
      }
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      setError('Email o contraseña Inválidos')
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 30,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Iniciar sesión
        </Typography>
        {error && (
        <Box mt={6} variant="h5" color="error.main">
          {error}
        </Box>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box mt={4} textAlign="center">
            <Button
              variant="contained"
              sx={{ backgroundColor: '#9900ff' }}
              size="large"
              type="submit"
            >
              Iniciar Sesión
            </Button>
          </Box>
        </Box>
      </Box>
      {showListarCentros && <ListarCentros />}
    </Container>
  );
};

export default Login;