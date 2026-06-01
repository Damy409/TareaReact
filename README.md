# Tarea React + Spring Boot: Login, JWT y Gestion de Cursos

## Damy Villegas - A00398942

Este proyecto contiene:

- Frontend en React + Vite.
- Backend en Java con Spring Boot.
- Compilacion con Gradle.
- Login con usuario y contrasena.
- Token JWT guardado en `localStorage`.
- Rutas protegidas con `useContext`.
- Lista de materias universitarias consumida desde el backend.
- Formulario con Material UI para agregar materias.
- Archivo `application.properties` para configurar el puerto y el JWT.

## Usuario de prueba

El usuario inicial esta definido en:

```bash
src/main/resources/data.sql
```

Credenciales:

```bash
Usuario: admin
Contrasena: 123456
```

## Rutas principales

Cuando se ejecuta Spring Boot, el proyecto queda en:

```bash
http://localhost:9081
http://localhost:9081/login
http://localhost:9081/courses
```

El API queda en:

```bash
http://localhost:9081/auth/api/auth/login
http://localhost:9081/auth/api/courses
```

## Como correr en desarrollo

Terminal 1: ejecutar Spring Boot.

```bash
./gradlew bootRun
```

En Windows tambien se puede usar:

```bash
gradlew.bat bootRun
```

Terminal 2: ejecutar React con Vite.

```bash
npm install
npm run dev
```

Luego abrir:

```bash
http://127.0.0.1:5173
```

El frontend en desarrollo consume el backend en:

```bash
http://localhost:9081/auth
```

## Como generar el JAR

Este es el comando equivalente al que usa el profesor:

```bash
./gradlew clean build
```

Si se quiere compilar sin pruebas:

```bash
./gradlew clean build -x test
```

El archivo generado queda en:

```bash
build/libs/auth-0.0.1-SNAPSHOT.jar
```

Ese `.jar` ya incluye el frontend compilado dentro del backend Spring Boot.

## Como ejecutar el JAR

```bash
java -jar build/libs/auth-0.0.1-SNAPSHOT.jar
```

Luego abrir:

```bash
http://localhost:9081
```


## Flujo de uso

1. Ejecutar Spring Boot con `./gradlew bootRun` o con el `.jar`.
2. Abrir `/login`.
3. Iniciar sesion con `admin` y `123456`.
4. Entrar a `/courses`.
5. Revisar las materias universitarias.
6. Agregar una materia nueva desde el formulario.


## Estructura importante

Frontend:

```bash
src/
  api/
  auth/
  pages/
  App.jsx
  main.jsx
  styles.css
```

Backend Spring Boot:

```bash
src/main/java/com/damy/tareareact/
  controller/
  dto/
  model/
  service/
  config/
  TareaReactApplication.java
```

Recursos:

```bash
src/main/resources/
  application.properties
  data.sql
```

