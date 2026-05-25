-- Datos iniciales del backend de prueba.
-- Usuario unico para iniciar sesion en el frontend:
-- usuario: admin
-- contrasena: 123456

INSERT INTO users (username, password) VALUES ('admin', '123456');

INSERT INTO courses (name, animal, description) VALUES
('Cuidado basico de perros', 'Perro', 'Curso introductorio sobre alimentacion, higiene y rutinas saludables.'),
('Bienestar de gatos', 'Gato', 'Curso sobre comportamiento, espacios seguros y cuidados diarios.'),
('Primeros pasos con aves', 'Ave', 'Curso sencillo sobre jaulas, alimentacion y limpieza.');
