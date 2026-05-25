import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { request } from '../api/client.js';
import { useAuth } from '../auth/AuthContext.jsx';

function normalizeCourses(data) {
  if (Array.isArray(data)) {
    return data;
  }

  return data?.courses || data?.content || data?.data || [];
}

function getCourseTitle(course) {
  return course?.name || course?.nombre || course?.title || course?.titulo || `Curso #${course?.id}`;
}

function getCourseDescription(course) {
  return course?.description || course?.descripcion || course?.details || course?.detalle || '';
}

function CourseForm({ onCreated }) {
  const [course, setCourse] = useState({ name: '', animal: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setCourse((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);

    try {
      const createdCourse = await request('/api/courses', {
        method: 'POST',
        body: JSON.stringify({
          name: course.name.trim(),
          animal: course.animal.trim(),
          description: course.description.trim(),
        }),
      });
      setCourse({ name: '', animal: '', description: '' });
      onCreated(createdCourse);
    } catch (err) {
      setError(err.message || 'No fue posible crear el curso.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Paper elevation={0} className="section-panel">
      <Stack spacing={2}>
        <Box>
          <Typography component="h2" variant="h6" fontWeight={700}>
            Agregar curso
          </Typography>
          <Typography variant="body2" color="text.secondary">
            El nuevo curso aparece en la lista inmediatamente.
          </Typography>
        </Box>
        {error && <Alert severity="error">{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              disabled={saving}
              fullWidth
              label="Nombre del curso"
              name="name"
              onChange={handleChange}
              required
              value={course.name}
            />
            <TextField
              disabled={saving}
              fullWidth
              label="Animal"
              name="animal"
              onChange={handleChange}
              required
              value={course.animal}
            />
            <TextField
              disabled={saving}
              fullWidth
              label="Descripcion"
              minRows={3}
              multiline
              name="description"
              onChange={handleChange}
              value={course.description}
            />
            <Button
              disabled={saving}
              startIcon={saving ? <CircularProgress color="inherit" size={18} /> : <AddIcon />}
              type="submit"
              variant="contained"
            >
              Agregar a la lista
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

export default function CoursesPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadCourses() {
    setError('');
    setLoading(true);

    try {
      const data = await request('/api/courses');
      setCourses(normalizeCourses(data));
    } catch (err) {
      setError(err.message || 'No fue posible cargar los cursos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  function handleCreatedCourse(createdCourse) {
    setCourses((currentCourses) => [createdCourse, ...currentCourses]);
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <Box minHeight="100vh">
      <AppBar position="static" color="inherit" elevation={0} className="top-bar">
        <Toolbar>
          <Typography component="h1" variant="h6" fontWeight={700} sx={{ flexGrow: 1 }}>
            Gestion de cursos
          </Typography>
          <Tooltip title="Recargar cursos">
            <span>
              <IconButton color="primary" disabled={loading} onClick={loadCourses}>
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Cerrar sesion">
            <IconButton color="primary" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" className="courses-shell">
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
          <Box flex={1} width="100%">
            <Paper elevation={0} className="section-panel">
              <Stack spacing={2}>
                <Box>
                  <Typography component="h2" variant="h6" fontWeight={700}>
                    Lista de cursos
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Esta ruta esta protegida. Solo carga si el login guardo un JWT valido.
                  </Typography>
                </Box>
                {error && <Alert severity="error">{error}</Alert>}
                {loading ? (
                  <Box className="loading-state">
                    <CircularProgress />
                  </Box>
                ) : courses.length === 0 ? (
                  <Alert severity="info">No hay cursos registrados todavia.</Alert>
                ) : (
                  <List disablePadding className="course-list">
                    {courses.map((course, index) => (
                      <Box key={course.id || `${getCourseTitle(course)}-${index}`}>
                        <ListItem alignItems="flex-start" disableGutters className="course-row">
                          <ListItemText
                            primary={
                              <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={1}
                                alignItems={{ xs: 'flex-start', sm: 'center' }}
                                justifyContent="space-between"
                              >
                                <Typography fontWeight={700}>{getCourseTitle(course)}</Typography>
                                <Chip
                                  color="primary"
                                  label={course.animal || 'Sin animal'}
                                  size="small"
                                  variant="outlined"
                                />
                              </Stack>
                            }
                            secondary={getCourseDescription(course)}
                          />
                        </ListItem>
                        {index < courses.length - 1 && <Divider component="li" />}
                      </Box>
                    ))}
                  </List>
                )}
              </Stack>
            </Paper>
          </Box>
          <Box width={{ xs: '100%', md: 380 }}>
            <CourseForm onCreated={handleCreatedCourse} />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
