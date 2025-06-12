import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ListarCentros = () => {
  const [centros, setCentros] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:5173/api/centros/allcenters')
      .then(response => {
        console.log("Centros recibidos desde el backend: ", response.data);
        setCentros(response.data);
      })
      .catch(error => {
        console.error('Error al obtener todos los centros: ', error);
      });
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500, marginBottom:20, marginLeft:10, marginRight:10 }} aria-label="customized table">
        <TableHead>
          <TableRow >
            <TableCell >Comuna</TableCell>
            <TableCell>Nombre del Centro</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Dirección</TableCell>
            <TableCell align="center">Teléfono</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {centros.map((centro, index) => (
            <TableRow key={index}>
              <TableCell>{centro[7]}</TableCell>
              <TableCell>{centro[1]}</TableCell>
              <TableCell>{centro[6]}</TableCell>
              <TableCell>{centro[2]} {centro[3]}</TableCell>
              <TableCell>{centro[4]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ListarCentros;
