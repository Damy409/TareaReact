# Guia de despliegue Spring Boot + Gradle

## 1. Preparar el proyecto

El proyecto ahora si usa:

- Java.
- Spring Boot.
- Gradle.
- `src/main/resources/application.properties`.
- Un `.jar` final en `build/libs`.

Antes de compilar, verificar que Java y Gradle funcionen:

```bash
java -version
gradle -version
```

## 2. Construir el JAR

Desde la carpeta del proyecto:

```bash
cd ~/Desktop/TareaReact/TareaReact
./gradlew clean build
```

Si el profesor pide saltar las pruebas:

```bash
./gradlew clean build -x test
```

Este comando tambien ejecuta el build del frontend React y lo mete dentro del JAR. No se debe subir la carpeta `dist` por separado.

El archivo que se debe subir queda en:

```bash
build/libs/auth-0.0.1-SNAPSHOT.jar
```

## 3. Revisar el puerto

El puerto esta definido en:

```bash
src/main/resources/application.properties
```

Valor actual:

```properties
server.port=9081
```

Si se  asigna otro puerto, cambiar ese valor antes de ejecutar `./gradlew clean build`.

## 4. Crear la carpeta en el servidor

Entrar al servidor:

```bash
ssh computacion2@192.168.131.110
```

Crear la carpeta:

```bash
mkdir -p sites/Damy/Damy-api
exit
```

## 5. Subir el JAR

Desde tu computador, dentro del proyecto:

```bash
scp build/libs/auth-0.0.1-SNAPSHOT.jar computacion2@192.168.131.110:sites/Damy/Damy-api
```

## 6. Subir application.properties

Tambien se sube el archivo de configuracion:

```bash
scp src/main/resources/application.properties computacion2@192.168.131.110:sites/Damy/Damy-api
```

## 7. Ejecutar en el servidor

Entrar al servidor:

```bash
ssh computacion2@192.168.131.110
cd sites/Damy/Damy-api
```

Si ya habia una version anterior corriendo en el puerto `9081`, detenerla antes de iniciar el JAR nuevo:

```bash
lsof -i :9081
kill -9 PID
```

Ejecutar el JAR usando el `application.properties` externo:

```bash
java -jar auth-0.0.1-SNAPSHOT.jar --spring.config.location=file:./application.properties
```

Si el servidor necesita dejarlo corriendo en segundo plano:

```bash
nohup java -jar auth-0.0.1-SNAPSHOT.jar --spring.config.location=file:./application.properties > app.log 2>&1 &
```

## 8. Probar el despliegue

Abrir:

```bash
http://192.168.131.110:9081
```

Si el navegador sigue mostrando una pantalla en blanco despues de subir el JAR nuevo, hacer una recarga fuerte con `Ctrl + F5` o abrir en una ventana de incognito. Eso evita que Chrome use un archivo JavaScript viejo guardado en cache.

Luego:

1. Iniciar sesion con `admin` y `123456`.
2. Entrar a `/courses`.
3. Confirmar que aparecen materias universitarias:
   - Computacion en Internet 2.
   - Matematicas Aplicadas.
   - Ciberseguridad.
4. Crear una materia nueva desde el formulario.

## 9. Comandos principales

Compilar:

```bash
./gradlew clean build
```

Compilar sin pruebas:

```bash
./gradlew clean build -x test
```

Subir JAR:

```bash
scp build/libs/auth-0.0.1-SNAPSHOT.jar computacion2@192.168.131.110:sites/Damy/Damy-api
```

Subir configuracion:

```bash
scp src/main/resources/application.properties computacion2@192.168.131.110:sites/Damy/Damy-api
```

Ejecutar:

```bash
java -jar auth-0.0.1-SNAPSHOT.jar --spring.config.location=file:./application.properties
```
