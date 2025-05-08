import { FormGroup, FormControl, InputLabel, Select, MenuItem, Button, Typography, Box, Grid } from '@mui/material';

function Mision() {

return(
<Grid container justifyContent="center" sx={{ marginTop: '120px' }}>
    <Grid item xs={12} sm={8} md={6}>
        <Typography variant="h2" gutterBottom align="center">
            Misión
        </Typography>
        <Typography variant="h6" gutterBottom align="center">
            "Facilitar la vida de las personas proporcionando productos/servicios de alta calidad que satisfagan sus necesidades y mejoren su bienestar diario. Nos comprometemos a ofrecer soluciones innovadoras, a mantener altos estándares éticos y a contribuir positivamente a las comunidades en las que operamos."
        </Typography>
    </Grid>
</Grid>
)
}
export default Mision;
