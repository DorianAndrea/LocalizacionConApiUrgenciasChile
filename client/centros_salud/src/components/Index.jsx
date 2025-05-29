import Centros_Valpo from './Centros_Valpo';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FormGroup, FormControl, InputLabel, Select, MenuItem, Button, Typography, Box, Grid, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
    const [regiones, setRegiones] = useState([]);
    const [comunas, setComunas] = useState([]);
    const [comunasFiltradas, setComunasFiltradas] = useState([]);
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedComuna, setSelectedComuna] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [showValidationMessage, setShowValidationMessage] = useState(false);
    const [showCentrosValpo, setShowCentrosValpo] = useState(false);
    const [openLocationPopup, setOpenLocationPopup] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://127.0.0.1:5000/api/data')
        .then(response => {
            console.log("Datos obtenidos: ", response.data);
            if (response.data && response.data.comunas && response.data.regiones) {
            setRegiones(response.data.regiones);
            setComunas(response.data.comunas);
            } else {
                console.error('La respuesta no tiene la estructura esperada');
            }
        })
        .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
    }, []);

    const handleRegionChange = (event) => {
        const regionId = event.target.value;
        setSelectedRegion(regionId);

        axios
        .get(`http://127.0.0.1:5000/api/comunas?region_id=${regionId}`)
        .then((response) => {
            setComunasFiltradas(response.data.comunas);
        })
        .catch((error) => {
            console.error('Error al obtener las comunas:', error);
        });
    };

    const handleComunaChange = (event) => {
        setSelectedComuna(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("selectedRegion:", selectedRegion);
        console.log("selectedComuna:", selectedComuna);

        if (!selectedRegion || !selectedComuna) {
            setShowValidationMessage(true);
            setShowCentrosValpo(false);
            setShowMessage(false);
            return;
        }

        console.log("Haciendo solicitud al backend con region:", selectedRegion, "y comuna:", selectedComuna);

        axios
        .get('http://127.0.0.1:5000/api/centros', {
            params: {
                regionId: selectedRegion,
                comunaId: selectedComuna,
            },
        })
        .then((response) => {
            console.log("Datos recibidos del backend:", response.data);
            if (response.data.length === 0) {
                setShowMessage(true);
            } else {
                sessionStorage.setItem("regionId", selectedRegion);
                sessionStorage.setItem("comunaId", selectedComuna);
                
                navigate('/centros');

            }
        })
        .catch((error) => {
            console.error('Error al enviar los datos:', error);
        });
    };

    const handleYesClick = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
            const { latitude, longitude } = position.coords;
            navigate('/mapa', { state: { latitude, longitude } });
            },
            (error) => {
            console.error('Error al obtener la ubicación:', error);
            }
        );
    };

    const handleNoClick = () => {
        setOpenLocationPopup(false);
    };

    return (
        <div>
        <Dialog open={openLocationPopup} onClose={handleNoClick}>
            <DialogTitle>Localización de Centros de Urgencias</DialogTitle>
            <DialogContent>
            <Typography variant="body1">¿Necesita atención de urgencias?</Typography>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleYesClick} color="primary" variant="contained">
                Sí
            </Button>
            <Button onClick={handleNoClick} color="secondary" variant="contained">
                No
            </Button>
            </DialogActions>
        </Dialog>

        <Box mt={30}>
            <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={6}>
                <FormGroup onSubmit={handleSubmit}>
                <Typography variant="h2" gutterBottom align="center">
                    ¡Bienvenidos!
                </Typography>
                <Typography variant="h5" gutterBottom align="center">
                    Seleccione la región y comuna para encontrar los centros de salud
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Región</InputLabel>
                            <Select value={selectedRegion} onChange={handleRegionChange} label="Región">
                                {regiones.map(region => (
                                    <MenuItem key={region.id} value={region.id}>{region.region_name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl variant="outlined" fullWidth>
                            <InputLabel>Comuna</InputLabel>
                            <Select value={selectedComuna} onChange={handleComunaChange} label="Comuna">
                                {comunasFiltradas.map(comuna => (
                                    <MenuItem key={comuna.id} value={comuna.id}>{comuna.name_comuna}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    </Grid>
                    <Box mt={4} textAlign="center">
                        <Button variant="contained" sx={{ backgroundColor: '#9900ff' }} size="large" type="submit" onClick={handleSubmit}>
                            Localizar
                        </Button>
                    </Box>
                    {showMessage && selectedRegion === 'REGION_VALPARAISO' && (
                        <Typography variant="h5" color="error" align="center" mt={2}>
                            **No hay centros disponibles en esta comuna.
                        </Typography>
                    )}
                    {showCentrosValpo && (<Centros_Valpo />)}
                    {showValidationMessage && (
                        <Typography variant="h5" color="error" align="center" mt={2}>
                            **Debe seleccionar una región y comuna.
                        </Typography>
                    )}
                </FormGroup>
            </Grid>
        </Grid>
        </Box>
        </div>
    );
};

export default Home;