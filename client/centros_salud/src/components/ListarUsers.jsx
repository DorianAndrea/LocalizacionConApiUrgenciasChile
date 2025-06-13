import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import esLocale from 'date-fns/locale/es'; // Importa el locale español
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


const apiUrl = import.meta.env.VITE_API_URL;
const ListarUser = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${apiUrl}/api/centros/allcenters`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };
        
        fetchUsers();
    }, []);

    // Función para formatear la fecha de creación
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "EEEE dd 'de' MMMM 'del' yyyy", { locale: esLocale });
    };

    return (
        <TableContainer component={Paper}>
            <Table sx={{minWidth:500, marginBottom:20, marginLeft:10, marginRight:10, alignContent: 'center'}} aria-label="Lista de usuarios">
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Rut</TableCell>
                        <TableCell>Fecha de Registro</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.first_name} {user.last_name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.rut}</TableCell>
                            <TableCell>{formatDate(user.created_at)}</TableCell>
                            {/* Agrega más celdas de datos según tus necesidades */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ListarUser;
