import { FormGroup, FormControl, InputLabel, Select, MenuItem, Button, Typography, Box, Grid } from '@mui/material';

function Nosotros() {

return(
<Grid container justifyContent="center"  sx={{ marginTop: '120px' }}>
    <Grid item xs={12} sm={8} md={6}>
        <Typography variant="h2" gutterBottom align="center">
            Nosotros
        </Typography>
        <Typography variant="h6" gutterBottom align="center">
            "Nos enorgullece no solo de lo que hacemos, sino también de cómo lo hacemos. Nuestro compromiso con la excelencia, la integridad y la responsabilidad social nos impulsa a alcanzar estándares más altos y a contribuir positivamente a las comunidades que servimos."
        </Typography>
    </Grid>
</Grid>
)
}
export default Nosotros;
