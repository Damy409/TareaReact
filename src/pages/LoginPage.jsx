import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';
import { LockIcon } from '../components/Icons.jsx';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/courses" replace />;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials.username.trim(), credentials.password);
      navigate('/courses', { replace: true });
    } catch (err) {
      setError(err.message || 'No fue posible iniciar sesion.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="xs" className="login-shell">
      <Paper elevation={0} className="login-panel">
        <Stack spacing={3} alignItems="center">
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <LockIcon />
          </Avatar>
          <Box textAlign="center">
            <Typography component="h1" variant="h5" fontWeight={700}>
              Iniciar sesion
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accede para consultar y registrar cursos.
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit} width="100%">
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}
              <Alert severity="info">Usuario: admin | Contrasena: 123456</Alert>
              <TextField
                autoComplete="username"
                autoFocus
                disabled={loading}
                fullWidth
                label="Usuario"
                name="username"
                onChange={handleChange}
                required
                value={credentials.username}
              />
              <TextField
                autoComplete="current-password"
                disabled={loading}
                fullWidth
                label="Contrasena"
                name="password"
                onChange={handleChange}
                required
                type="password"
                value={credentials.password}
              />
              <Button disabled={loading} fullWidth size="large" type="submit" variant="contained">
                {loading ? <CircularProgress color="inherit" size={24} /> : 'Entrar'}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
}
