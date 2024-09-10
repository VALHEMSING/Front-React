import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';

const Home = () => {
    const [cursos, setCursos] = useState([]);
    const [selectedCurso, setSelectedCurso] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [formValues, setFormValues] = useState({
      nombre: '',
      email: '',
      password: ''
    });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        fetchCursos();
    }, []);

    const fetchCursos = async () => {
        try {
            const response = await fetch('https://localhost:3000/api/cursos');
            if (!response.ok) throw new Error('Error al obtener los cursos');
            const data = await response.json();
            setCursos(data);
        } catch (error) {
            console.error('Error al obtener cursos:', error);
            setErrorMessage('Error al obtener cursos');
            setOpenSnackbar(true);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedCurso(null);
        setFormValues({
            nombre: '',
            email: '',
            password: ''
        });
    };

    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegisterAndEnroll = async () => {
        try {
            // Intentar registrar el usuario
            const createUserResponse = await fetch('https://localhost:3000/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formValues),
            });

            if (createUserResponse.status !== 409 && !createUserResponse.ok) {
                const errorData = await createUserResponse.json();
                throw new Error(errorData.error || 'Error al registrar al usuario');
            }

            // Si el usuario ya existe o se ha creado correctamente
            const email = formValues.email;

            // Inscribir al usuario al curso
            const enrollResponse = await fetch(`https://localhost:3000/api/${email}/cursos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ cursos: [selectedCurso._id] }),
            });

            if (!enrollResponse.ok) {
                const errorData = await enrollResponse.json();
                throw new Error(errorData.error || 'Error al inscribir al usuario en el curso');
            }

            setOpenSnackbar(true);
            setErrorMessage('Usuario registrado e inscrito en el curso con éxito');
            handleCloseModal();
        } catch (error) {
            console.error('Error al registrar o inscribir el usuario', error);
            setErrorMessage(error.message);
            setOpenSnackbar(true);
        }
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorMessage('');
    };

    const handleCardClick = (curso) => {
        setSelectedCurso(curso);
        setOpenModal(true);
    };

    return (
        <>
            <Container>
                <Typography variant="h4" gutterBottom>
                    Cursos Disponibles
                </Typography>
                <Grid container spacing={3}>
                    {cursos.map((curso) => (
                        <Grid item xs={12} sm={6} md={4} key={curso._id}>
                            <Card onClick={() => handleCardClick(curso)}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={curso.imagen}
                                    alt={curso.titulo}
                                    onError={() => setErrorMessage('Error cargando imagen')}
                                    style={{ borderRadius: '50%', width: 140, height: 140, margin: 'auto' }}
                                />
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {curso.titulo}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
                    <DialogTitle>Registro e Inscripción</DialogTitle>
                    <DialogContent>
                        <Typography variant="h6">{selectedCurso?.titulo}</Typography>
                        <TextField
                            label="Nombre"
                            name="nombre"
                            value={formValues.nombre}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formValues.email}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Contraseña"
                            name="password"
                            type="password"
                            value={formValues.password}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal} color="default">Cancelar</Button>
                        <Button onClick={handleRegisterAndEnroll} color="primary">Registrarse e Inscribirse</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity={errorMessage.includes('éxito') ? 'success' : 'error'} sx={{ width: '100%' }}>
                        {errorMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </>
    );
};

export default Home;
