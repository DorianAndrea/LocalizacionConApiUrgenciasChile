import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from '@mui/material';

const apiUrl = import.meta.env.VITE_API_URL; 
const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [rut, setRut] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    firstName:null,
    lastName:null,
    rut: null,
    password:null,
    confirmPassword:null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validar que los campos no estén vacíos
    const newErrors = {
      firstName: !firstName ? '*Debe ingresar Nombre' : null,
      lastName: !lastName ? '*Debe ingresar Apellido' : null,
      rut: !rut ? '*Debe ingresar el rut' : null,
      email: !email ? '*Debe ingresar un email' : null,
      password: !password ? '*Debe ingresar una contraseña' : null,
      confirmPassword: !confirmPassword ? '*Debe confirmar la contraseña' : null,
    };
  
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = '*Correo electrónico no válido';
    }
    setErrors(newErrors);
  
    if (Object.values(newErrors).some((error) => error !== null)) return;
  
    try {
      const response = await axios.post(`${apiUrl}/api/registro`, {
        first_name: firstName,
        last_name: lastName,
        rut: rut,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });
      console.log('User registered:', response.data);
      console.log('El usuario se registra?', response);
      navigate('/listarUsuarios');
    } catch (error) {
      console.error('Error registering user:', error.response.data.message);
      setErrors({ ...errors, email: error.response.data.message });
  }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h2"  sx={{ marginTop: '60px' }}>
          Registro de Usuarios
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="firstName"
            label="Nombre"
            name="firstName"
            autoComplete="given-name"
            autoFocus
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}

          />
          <TextField
            margin="normal"
            fullWidth
            id="lastName"
            label="Apellido"
            name="lastName"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
          />
            <TextField
            margin="normal"
            fullWidth
            id="rut"
            label="Rut"
            name="rut"
            autoComplete="family-name"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            error={!!errors.rut}
            helperText={errors.rut}
          />
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Correo electrónico"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Contraseña"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <TextField
            margin="normal"
            fullWidth
            name="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />
          <Box mt={1} textAlign="center">
          <Button
            type="submit" size='large'
            variant="contained"
            sx={{ mt: 2, mb: 2, backgroundColor: '#9900ff' }}
          >
            Registrarse
          </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;