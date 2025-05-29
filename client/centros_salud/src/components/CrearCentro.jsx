import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
} from '@mui/material';

const CrearCentro = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedComuna, setSelectedComuna] = useState('');
  const [regiones, setRegiones] = useState([]);
  const [comunas, setComunas] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nameCentro: '',
    pagWeb: '',
    apiLink: '',
    email: '',
    address: '',
    numberAdd: '',
    phone: '',
    cellPhone: '',
  });

  const [errors, setErrors] =useState({
    nameCentro:null,
    pagWeb:null,
    apiLink: null,
    email: null,
    address: null,
    numberAdd: null,
    phone: null,
    cellPhone: null,
  });
  useEffect(() => {
    fetchRegionesAndComunas();
  }, []);

  const fetchRegionesAndComunas = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/api/data');
      if(response.data && response.data.regiones && response.data.comunas){
        setRegiones(response.data.regiones);
        setComunas(response.data.comunas);
      }else{
        console.log('La respuesta no contiene la estructura esperada');
        
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegionChange = (event) => {
    const selectedRegion = event.target.value;
    setSelectedRegion(selectedRegion);

    const filteredComunas = comunas.filter(
      (comuna) => comuna.region_id === selectedRegion
    );
    setComunas(filteredComunas);
    setSelectedComuna('');
  };

  const handleComunaChange = (event) => {
    setSelectedComuna(event.target.value);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //validar que los campos no estén vacios
    const newErrors = {
      nameCentro: !formData.nameCentro ? '*Debe Ingresar nombre del centro de salud' : null,
      apiLink: !formData.apiLink ? '*Debe ingresar el link para localizar el centro': null,
      email: !formData.email ? '*Debe ingresar un email':null,
      address: !formData.address ? '*Debe ingresar una dirección válida ':null,
      numberAdd: !formData.numberAdd ? '*Debe ingresar un número':null,
      phone: !formData.phone ? '*Debe ingresar un teléfono': null, 
    }
     //Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = '*Correo electrónico no válido';
    }
    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error !== null)) return;

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/centros', {
        name_centro: formData.nameCentro,
        pag_web: formData.pagWeb,
        api_link: formData.apiLink,
        email: formData.email,
        address: formData.address,
        number_add: formData.numberAdd,
        phone: formData.phone,
        cell_phone: formData.cellPhone,
        comuna_id: selectedComuna,
      });
      console.log(response.data);
      setFormData({
        nameCentro: '',
        pagWeb: '',
        apiLink: '',
        email: '',
        address: '',
        numberAdd: '',
        phone: '',
        cellPhone: '',
      });
      setSelectedRegion('');
      setSelectedComuna('');
      navigate('/listarCentros');
    } catch (error) {
      console.error(error);
      //verificar si el error tiene la propiedad 'message' antes de acceder a ella
      if(error.response && error.response.data && error.response.message){
        setErrors({...errors, email:error.response.data.message});
      }else{
        setErrors({...error, email: 'Error desconocido'});
      }

    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h2" align="center" gutterBottom>
        Crear Centro
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="region-label">Región</InputLabel>
              <Select
                labelId="region-label"
                value={selectedRegion}
                onChange={handleRegionChange}
              >
                {regiones.map((region) => (
                  <MenuItem key={region.id} value={region.id}>
                    {region.region_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="comuna-label">Comuna</InputLabel>
              <Select
                labelId="comuna-label"
                value={selectedComuna}
                onChange={handleComunaChange}
              >
                {comunas.map((comuna) => (
                  <MenuItem key={comuna.id} value={comuna.id}>
                    {comuna.name_comuna}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nombre del Centro"
              fullWidth
              name="nameCentro"
              value={formData.nameCentro}
              onChange={handleChange}
              error={!!errors.nameCentro}
              helperText={errors.nameCentro}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Página Web"
              fullWidth
              name="pagWeb"
              value={formData.pagWeb}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="API Link"
              fullWidth
              name="apiLink"
              value={formData.apiLink}
              onChange={handleChange}
              error={!!errors.apiLink}
              helperText={errors.apiLink}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Dirección"
              fullWidth
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Número"
              fullWidth
              name="numberAdd"
              value={formData.numberAdd}
              onChange={handleChange}
              error={!!errors.numberAdd}
              helperText={errors.numberAdd}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teléfono"
              fullWidth
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Celular"
              fullWidth
              name="cellPhone"
              value={formData.cellPhone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit" 
              size='large'
              fullWidth
              variant="contained"
              sx={{ backgroundColor: '#9900ff', ms:2, mb:2 }}>
              Crear Centro
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default CrearCentro;