# Tarea React: Login, JWT y Gestion de Cursos

## Damy Villegas - A00398942

Este proyecto implementa la tarea completa del PDF:

- Login con usuario y contrasena.
- Token JWT guardado en `localStorage`.
- Rutas protegidas con `useContext`.
- Lista de cursos consumida desde un backend.
- Formulario con Material UI para agregar cursos.
- Backend local de prueba con usuario inicial cargado desde `server/data.sql`.

La parte visual esta hecha en React. El backend es minimo y solo existe para que la tarea pueda probarse completa sin depender de otro servidor.

## Usuario de prueba

El usuario inicial esta definido en:

```bash
server/data.sql
```

Credenciales:

```bash
Usuario: admin
Contrasena: 123456
```

Con ese usuario y esta contraseña se puede ingresar al login, para visualizar las demas pantallas de los cursos.

## Rutas principales

Frontend:

```bash
http://127.0.0.1:5173
http://127.0.0.1:5173/login
http://127.0.0.1:5173/courses
```

Backend:

```bash
http://localhost:8080/auth
```

## Como correr el proyecto

Se tiene que abrir dos terminales en la misma carpeta:

```bash
C:\Users\Damy\Desktop\TareaReact\TareaReact
```

Pero tambien se puede entrar desde Git Bash con:

```bash
cd ~/Desktop/TareaReact/TareaReact
```

## Terminal 1: correr el backend

Primero se debe instalar las dependencias en caso de no tenerlas:

```bash
npm install
```

Posteriormente se corre el backend:

```bash
npm run server
```

El resultado debe verse similar a esto: 

```bash
Backend listo en http://localhost:8080/auth
Usuario de prueba: admin
Contrasena de prueba: 123456
```

La terminal se la deja abierta.

## Terminal 2: correr el frontend

En otra terminal, dentro de la misma carpeta del proyecto, se ejecuta:

```bash
npm run dev
```

y Vite mostrara una URL. Se abre esta:

```bash
http://127.0.0.1:5173
```

Si se abre desde la raiz, la aplicacion nos manda automaticamente al login:

```bash
http://127.0.0.1:5173/login
```

## Flujo de uso

1. Correr el backend con `npm run server`.
2. Correr el frontend con `npm run dev`.
3. Abrir `http://127.0.0.1:5173/login`.
4. Escribir las credenciales:

```bash
Usuario: admin
Contrasena: 123456
```

5. Presionar `Entrar`.
6. Si el login es correcto, React guarda el JWT en `localStorage`.
7. Luego se entra a `/courses`.
8. En `/courses` se puede ver la lista de cursos.
9. En el formulario se puede agregar un curso nuevo.
10. El curso nuevo aparece en la lista inmediatamente.

## Seguridad con JWT

La ruta `/courses` esta protegida en el frontend por:

```bash
src/auth/ProtectedRoute.jsx
```

Si no hay token en `localStorage`, no se puede entrar a la pantalla de cursos y la aplicacion te devuelve al login.

El backend tambien valida el JWT. Los endpoints de cursos requieren este header:

```bash
Authorization: Bearer TOKEN
```

Ese header se agrega automaticamente desde:

```bash
src/api/client.js
```

## Endpoints del backend

Login:

```bash
POST http://localhost:8080/auth/api/auth/login
```

Body:

```json
{
  "username": "admin",
  "password": "123456"
}
```

Listar cursos:

```bash
GET http://localhost:8080/auth/api/courses
```

Crear curso:

```bash
POST http://localhost:8080/auth/api/courses
```

Body:

```json
{
  "name": "Curso de reptiles",
  "animal": "Reptil",
  "description": "Cuidados basicos para reptiles domesticos."
}
```

## Donde esta cada parte

Frontend:

```bash
src/
  api/
    client.js
  auth/
    AuthContext.jsx
    ProtectedRoute.jsx
  pages/
    LoginPage.jsx
    CoursesPage.jsx
  App.jsx
  main.jsx
  styles.css
```

Backend:

```bash
server/
  data.sql
  index.js
```

## Nota importante

Los cursos que se agregen se guardan en memoria mientras el backend esta corriendo. Si se cierra `npm run server` y luego se vuelve a abrir, se cargaran los datos otra vez.
