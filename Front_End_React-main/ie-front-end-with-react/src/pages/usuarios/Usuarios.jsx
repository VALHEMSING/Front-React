import React, { useState, useEffect } from 'react';
import {
    Container,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Switch,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Snackbar,
    Alert,
    Checkbox,
    List,
    ListItem,
    ListItemText
} from '@mui/material';

import {
    Edit,
    Delete,
    Visibility,
    VisibilityOff,
    Info,
    Add
} from '@mui/icons-material';

const Usuarios = () => {
    // Estados para almacenar datos
    const [usuarios, setUsuarios] = useState([]); // Almacena todos los usuarios
    const [cursos, setCursos] = useState([]); // Almacena todos los cursos
    const [selectedUsuario, setSelectedUsuario] = useState(null); // Usuario seleccionado
    const [formValues, setFormValues] = useState({
        nombre: ' ',
        email: ' ',
        password: '',
        estado: true,
        imagen: ' '
    }); // Valores del formulario para crear/editar usuarios
    const [showPassword, setShowPassword] = useState(false); // Controlar visibilidad de contraseña
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Controlar diálogo de eliminación
    const [openInfoDialog, setOpenInfoDialog] = useState(false); // Controlar diálogo de información
    const [openAddCursosDialog, setOpenAddCursosDialog] = useState(false); // Modal para agregar cursos
    const [selectedCursos, setSelectedCursos] = useState([]); // Cursos seleccionados para asociar al usuario
    const [usuarioInfo, setUsuarioInfo] = useState(null); // Información detallada de un usuario
    const [errorMessage, setErrorMessage] = useState(null); // Mensaje de error
    const [openSnackbar, setOpenSnackbar] = useState(false); // Controlar snackbar (notificación)
    const defaultImage = 'https://via.placeholder.com/50'; // URL de imagen por defecto

    // Efecto para cargar usuarios y cursos al montar el componente
    useEffect(() => {
        fetchUsuarios();
        fetchCursos();
    }, []);

    // ... resto del código del componente


    const fetchUsuarios = async () => {
        try {
            const response = await fetch('https://localhost:3000/api/usuarios');
            if (!response.ok) throw new Error('Error al obtener usuarios');
            const data = await response.json();
            setUsuarios(data.filter(usuario => usuario.estado));
        } catch (error) {
            handleError(error, 'Error al obtener usuarios');
        }
    };

    const fetchCursos = async () => {
        try {
            const response = await fetch('https://localhost:3000/api/cursos');
            if (!response.ok) throw new Error('Error al obtener cursos');
            const data = await response.json();
            setCursos(data);
        } catch (error) {
            handleError(error, 'Error al obtener cursos');
        }
    };

    const handleInputChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.value,
        });
    };

    const handleSwitchChange = (e) => {
        setFormValues({
            ...formValues,
            [e.target.name]: e.target.checked,
        });
    };


    const handleCreateUsuario = async () => {
        try {
            const response = await fetch('https://localhost:3000/api/usuarioss', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear usuario');
            }

            await fetchUsuarios();
            resetForm();
        } catch (error) {
            handleError(error, 'Error al crear usuario');
        }
    };

    const handleUpdateUsuario = async () => {
        // Si no hay un usuario seleccionado, se sale de la función
        if (!isSelectedUsuario?.email) return;

        try {
            // Realiza una solicitud PUT al servidor para actualizar un usuario
            const response = await fetch(`https://localhost:3000/api/usuarios/${selectedUsuario.email}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formValues),
            });

            // Si la respuesta no es exitosa, se lanza un error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al actualizar usuario');
            }

            // Actualiza la lista de usuarios y restablece el formulario
            await fetchUsuarios();
            resetForm();
        } catch (error) {
            // Maneja cualquier error que ocurra durante la actualización
            handleError(error, 'Error al actualizar usuario');
        }
    };


    const handleDeleteUsuario = async () => {
        // Si no hay un usuario seleccionado, se sale de la función
        if (!isSelectedUsuario?.email) return;

        try {
            // Realiza una solicitud DELETE al servidor para eliminar un usuario
            const response = await fetch(`https://localhost:3000/api/usuarios/${selectedUsuario.email}`, {
                method: 'DELETE',
            });

            // Si la respuesta no es exitosa, se lanza un error
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al eliminar usuario');
            }

            // Actualiza la lista de usuarios y cierra el diálogo de confirmación
            await fetchUsuarios();
            handleCloseDeleteDialog();
        } catch (error) {
            // Maneja cualquier error que ocurra durante la eliminación
            handleError(error, 'Error al eliminar usuario');
        }
    };


    const handleEditClick = (usuario) => {
        // Establece el usuario seleccionado en el estado
        setSelectedUsuario(usuario);

        // Establece los valores del formulario con los datos del usuario
        setFormValues({
            nombre: usuario.nombre || '',
            email: usuario.email || '',
            password: usuario.password || '',
            estado: usuario.estado ?? true,
            imagen: usuario.imagen || '',
        });
    };


    const handleDeleteClick = (usuario) => {
        // Establece el usuario seleccionado en el estado
        setSelectedUsuario(usuario);

        // Abre el diálogo de confirmación de eliminación
        setOpenDeleteDialog(true);
    };

    const handleInfoClick = async (usuario) => {
        // Establece el usuario seleccionado en el estado
        setSelectedUsuario(usuario);

        try {
            // Realiza una solicitud al servidor para obtener la información del usuario y sus cursos
            const response = await fetch(`https://localhost:3000/api/cursos/${usuario.id}/usuarios`);

            // Si la respuesta no es exitosa, lanza un error
            if (!response.ok) throw new Error('Error al obtener la información del usuario');

            // Obtiene los cursos del usuario desde la respuesta
            const cursos = await response.json();

            // Actualiza el estado con la información del usuario y sus cursos
            setUsuarioInfo({ ...usuario, usuarios: cursos });
        } catch (error) {
            // Maneja el error y establece un estado por defecto para los cursos
            console.error('Error al obtener la información del usuario:', error);
            setUsuarioInfo({ ...usuario, usuarios: [] });
        }

        // Abre el diálogo de información del usuario
        setOpenInfoDialog(true);
    };



    const handleAddCursosClick = async (usuario) => {
        // Establece el usuario seleccionado en el estado
        setSelectedUsuario(usuario);

        try {
            // Realiza una solicitud al servidor para obtener los cursos del usuario
            const response = await fetch(`https://localhost:3000/api/usuarios/${usuario.id}/cursos`);

            // Si la respuesta no es exitosa, lanza un error
            if (!response.ok) {
                throw new Error('Error al obtener los cursos del usuario');
            }

            // Obtiene los cursos del usuario desde la respuesta
            const cursosUsuario = await response.json();

            // Establece los cursos seleccionados del usuario en el estado
            setSelectedCursos(cursosUsuario.map(curso => curso._id)); // Preselecciona los cursos ya asociados

        } catch (error) {
            // Maneja el error y muestra un mensaje de error
            handleError(error, 'Error al obtener los cursos del usuario');
        }

        // Abre el diálogo para agregar cursos
        setOpenAddCursosDialog(true);
    };

    const handleSaveCursos = async () => {
        if (!selectedUsuario) return;

        try {
            const response = await fetch(`https://localhost:3000/api/usuarios/${selectedUsuario.email}/cursos`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cursos: selectedCursos })
            });

            if (!response.ok) {
                const text = await response.text(); // Lee el contenido completo como texto
                console.error('Respuesta del servidor:', text); // Muestra el texto para investigar
                throw new Error('Error en la solicitud. Verifique la respuesta.');
            }

            await fetchUsuarios();
            setOpenAddCursosDialog(false);

        } catch (error) {
            handleError(error, 'Error al asociar cursos al usuario');
        }
    };


    const handleCursosChange = (cursoId) => {
        // Si el curso ya está seleccionado, lo eliminamos de la lista
        if (selectedCursos.includes(cursoId)) {
            setSelectedCursos(selectedCursos.filter(id => id !== cursoId));
        } else {
            // Si el curso no está seleccionado, lo agregamos a la lista
            setSelectedCursos([...selectedCursos, cursoId]);
        }
    };


    const handleCloseInfoDialog = () => {
        // Cierra el diálogo de información
        setOpenInfoDialog(false);

        // Limpia la información del usuario
        setUsuarioInfo(null);
    };


    const handleCloseAddCursosDialog = () => {
        setOpenAddCursosDialog(false);
        setSelectedCursos([])
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedUsuario(null);
    }

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
        setErrorMessage(null);
    }

    const handleformSubmit = (e) => {
        e.preventDefault();
        if (selectedUsuario) {
            handleUpdateUsuario();
        }
        else {
            handleCreateUsuario();
        }
    }


    const resetForm = () => {
        // Restablece el usuario seleccionado
        setSelectedUsuario(null);

        // Restablece los valores del formulario a sus valores iniciales
        setFormValues({
            nombre: '',
            email: '',
            password: '',
            estado: true,
            imagen: ''
        });
    };


    const handleError = (error, defaultMessage) => {
        // Registra el error en la consola con un mensaje por defecto si no hay uno específico
        console.error(defaultMessage, error);

        // Establece el mensaje de error en el estado, priorizando el mensaje del error si existe
        setErrorMessage(error.message || defaultMessage);

        // Muestra un snackbar (notificación) indicando que ha ocurrido un error
        setOpenSnackbar(true);
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (

        <Container>
            <Typography variant="h4" gutterBottom>
                Gestión de Usuarios
            </Typography>
            <form onSubmit={handleformSubmit}>
                {/* Campo de texto para el nombre */}
                <TextField
                    fullWidth
                    margin="normal"
                    name="nombre"
                    label="Nombre"
                    value={formValues.nombre}
                    onChange={handleInputChange}
                />
                {/* Campo de texto para el email */}
                <TextField
                    fullWidth
                    margin="normal"
                    name="email"
                    label="Email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    disabled={selectedUsuario !== null}
                />
                {/* Campo de texto para la contraseña */}
                <TextField
                    fullWidth
                    margin="normal"
                    name="password"
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    value={formValues.password}
                    onChange={handleInputChange}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={togglePasswordVisibility}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        ),
                    }}
                />
                {/* Switch para el estado */}
                <Box display="flex" alignItems="center" marginY={2}>
                    <Switch
                        name="estado"
                        checked={formValues.estado}
                        onChange={handleSwitchChange}
                    />
                    <Typography>Estado activo</Typography>
                </Box>
                <TextField
                    fullWidth
                    margin="normal"
                    name="imagen"
                    label="Imagen"
                    value={formValues.imagen}
                    onChange={handleInputChange}
                />
                <Button type="submit" variant="contained" color="primary">
                    {selectedUsuario ? 'Actualizar Usuario' : 'Crear Usuario'}
                </Button>
            </form>


            <TableContainer component={Paper} style={{ marginTop: '2rem' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Imagen</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {usuarios.map(usuario => (
                            <TableRow key={usuario.email}>
                                <TableCell>{usuario.nombre}</TableCell>
                                <TableCell>{usuario.email}</TableCell>
                                <TableCell>{usuario.estado ? 'Activo' : 'Inactivo'}</TableCell>
                                <TableCell>
                                    <img
                                        src={usuario.imagen || defaultImage}
                                        alt={usuario.nombre}
                                        style={{ width: 50, height: 56, objectFit: 'cover' }}
                                        onError={(e) => e.target.src = defaultImage}
                                    />
                                </TableCell>
                                <TableCell>
                                    {/* //Editar Usuario*/}
                                    <IconButton onClick={() => handleEditClick(usuario)} color="primary">
                                        <Edit />

                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteClick(usuario)} color="secondary">
                                        <Delete />
                                    </IconButton>

                                    <IconButton onClick={() => handleInfoClick(usuario)} color="info">
                                        <Info />
                                    </IconButton>

                                    <IconButton onClick={() => handleAddCursosClick(usuario)} color="primary">
                                        <Add />
                                    </IconButton>
                                    {/* Otros botones con funciones similares */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>{'Confirmar Eliminación'}</DialogTitle>
                <DialogContent>
                    <Typography>
                        ¿Estás seguro de que quieres eliminar al usuario {selectedUsuario?.nombre}?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
                    <Button onClick={handleDeleteUsuario} color="secondary">Eliminar</Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
                <DialogTitle>Información del Usuario</DialogTitle>
                <DialogContent>
                    {usuarioInfo && (
                        <>
                            <Typography><strong>Nombre:</strong> {usuarioInfo.nombre}</Typography>
                            <Typography><strong>Email:</strong> {usuarioInfo.email}</Typography>
                            <Typography><strong>Estado:</strong> {usuarioInfo.estado ? 'Activo' : 'Inactivo'}</Typography>
                            <Typography><strong>Cursos inscritos:</strong></Typography>
                            {usuarioInfo.cursos && usuarioInfo.cursos.length > 0 ? (
                                <ul>
                                    {usuarioInfo.cursos.map((curso, index) => (
                                        <li key={index}>{curso.titulo}</li>
                                    ))}
                                </ul>
                            ) : (
                                <Typography>No está inscrito en ningún curso</Typography>
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseInfoDialog}>Cerrar</Button>
                </DialogActions>
            </Dialog>

            {/* Modal para Agregar Cursos */}
            <Dialog open={openAddCursosDialog} onClose={handleCloseAddCursosDialog}>
                <DialogTitle>Agregar Cursos al Usuario</DialogTitle>
                <DialogContent>
                    <List>
                        {cursos.map((curso) => (
                            <ListItem key={curso._id} button onClick={() => handleCursosChange(curso._id)}>
                                <Checkbox checked={selectedCursos.includes(curso._id)} />
                                <ListItemText primary={curso.titulo} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAddCursosDialog}>Cancelar</Button>
                    <Button onClick={handleSaveCursos} color="primary">Guardar</Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error">
                    {errorMessage}
                </Alert>
            </Snackbar>


        </Container>

    );

};

export default Usuarios;