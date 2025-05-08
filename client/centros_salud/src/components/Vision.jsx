import { FormGroup, FormControl, InputLabel, Select, MenuItem, Button, Typography, Box, Grid } from '@mui/material';

function Vision() {

return(
<Grid container justifyContent="center"  sx={{ marginTop: '120px' }}>
    <Grid item xs={12} sm={8} md={6}>
        <Typography variant="h2" gutterBottom align="center">
            Misión
        </Typography>
        <Typography variant="h6" gutterBottom align="center">
            "Ser líderes reconocidos a nivel mundial en nuestro sector, siendo reconocidos por nuestra excelencia en la innovación, la calidad y el servicio al cliente. Nos esforzamos por crear un mundo mejor a través de nuestros productos/servicios y por ser un referente en sostenibilidad y responsabilidad social corporativa."
        </Typography>
    </Grid>
</Grid>
)
}
export default Vision;