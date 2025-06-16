import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import { useNavigate } from 'react-router-dom';

const Centros_Valpo = () => {
  const [centros, setCentros] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const regionId = sessionStorage.getItem("regionId");
    const comunaId = sessionStorage.getItem("comunaId");

    if (!regionId || !comunaId) {
      console.error("Faltan parámetros de región o comuna");
      navigate("/");
      return;
    }

    axios
      .get(`${apiUrl}/api/centros`, {
        params: {
          regionId,
          comunaId,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          console.log("Centros recibidos desde backend:", response.data); // 👈 AÑADE ESTA LÍNEA
          setCentros(response.data);
        } else {
          console.error("La respuesta no es un arreglo:", response.data);
          setCentros([]);
        }
      })
      
      .catch((error) => {
        console.error("Error al obtener los centros:", error);
        setCentros([]);
      });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '60px' }}>
      {centros.map((centro, index) => (
        <Card
          key={index}
          style={{
            width: '90%',
            marginBottom: index === centros.length - 1 ? '60px' : '20px',
          }}
        >
          <CardHeader
            title={
              <Typography variant="h4" style={{ wordBreak: 'break-word', textAlign: 'center' }}>
                {centro.name_centro}
              </Typography>
            }
          />
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, padding: '16px', marginLeft: '30px' }}>
              <Typography variant="body1" gutterBottom>
                Dirección: {centro.address} {centro.number_add}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Teléfono: {centro.phone || 'No disponible'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Celular: {centro.cell_phone || 'No disponible'}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Comuna: {centro.name_comuna}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Página Web: {centro.pag_web}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Email: {centro.email}
              </Typography>
              <div>
                <IconButton><FacebookIcon /></IconButton>
                <IconButton><InstagramIcon /></IconButton>
                <IconButton><TwitterIcon /></IconButton>
              </div>
            </div>
            <div style={{ flex: 1, padding: '16px', marginRight: '40px' }}>
              <iframe
                src={centro.api_link}
                width="100%"
                height="300"
                style={{ border: 0, aspectRatio: '1/1' }}
                allowFullScreen
                referrerPolicy='no-referrer-when-downgrade'
                title={`Mapa ${index}`}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default Centros_Valpo;