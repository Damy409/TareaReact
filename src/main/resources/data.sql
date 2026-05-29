-- Datos iniciales del backend Spring Boot.
-- Usuario unico para iniciar sesion en el frontend:
-- usuario: admin
-- contrasena: 123456

INSERT INTO users (username, password) VALUES ('admin', '123456');

INSERT INTO courses (name, area, description) VALUES
('Computacion en Internet 2', 'Ingenieria de sistemas', 'Materia enfocada en aplicaciones web, consumo de APIs, autenticacion y despliegue.'),
('Matematicas Aplicadas', 'Ciencias basicas', 'Curso sobre modelos matematicos, analisis de datos y solucion de problemas aplicados.'),
('Ciberseguridad', 'Seguridad informatica', 'Materia sobre proteccion de sistemas, buenas practicas, riesgos y controles de seguridad.');
