import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 8080;
const JWT_SECRET = 'tarea-react-secret-key';
const TOKEN_EXPIRATION_SECONDS = 60 * 60 * 2;

const state = loadInitialData();

function loadInitialData() {
  const sqlPath = path.join(__dirname, 'data.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const users = [];
  const courses = [];

  const userRegex =
    /INSERT INTO users \(username, password\) VALUES \('([^']+)', '([^']+)'\);/gi;
  let userMatch = userRegex.exec(sql);

  while (userMatch) {
    users.push({
      id: users.length + 1,
      username: userMatch[1],
      password: userMatch[2],
    });
    userMatch = userRegex.exec(sql);
  }

  const courseRegex = /\('([^']+)', '([^']+)', '([^']+)'\)/g;
  let courseMatch = courseRegex.exec(sql);

  while (courseMatch) {
    if (courseMatch[1] !== 'admin') {
      courses.push({
        id: courses.length + 1,
        name: courseMatch[1],
        animal: courseMatch[2],
        description: courseMatch[3],
      });
    }
    courseMatch = courseRegex.exec(sql);
  }

  return { users, courses };
}

function base64UrlEncode(input) {
  return Buffer.from(JSON.stringify(input)).toString('base64url');
}

function sign(value) {
  return crypto.createHmac('sha256', JWT_SECRET).update(value).digest('base64url');
}

function createToken(user) {
  const header = base64UrlEncode({ alg: 'HS256', typ: 'JWT' });
  const payload = base64UrlEncode({
    sub: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRATION_SECONDS,
  });
  const unsignedToken = `${header}.${payload}`;

  return `${unsignedToken}.${sign(unsignedToken)}`;
}

function verifyToken(token) {
  if (!token) {
    return null;
  }

  const [header, payload, signature] = token.split('.');

  if (!header || !payload || !signature) {
    return null;
  }

  const expectedSignature = sign(`${header}.${payload}`);

  if (signature !== expectedSignature) {
    return null;
  }

  const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));

  if (data.exp < Math.floor(Date.now() / 1000)) {
    return null;
  }

  return data;
}

function sendJson(response, statusCode, data) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  });
  response.end(data === null ? '' : JSON.stringify(data));
}

function getRequestBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';

    request.on('data', (chunk) => {
      body += chunk;
    });

    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('JSON invalido'));
      }
    });
  });
}

function getBearerToken(request) {
  const authorization = request.headers.authorization || '';

  if (!authorization.startsWith('Bearer ')) {
    return null;
  }

  return authorization.slice('Bearer '.length);
}

function requireAuth(request, response) {
  const token = getBearerToken(request);
  const session = verifyToken(token);

  if (!session) {
    sendJson(response, 401, { message: 'No autorizado. Inicia sesion primero.' });
    return null;
  }

  return session;
}

async function handleLogin(request, response) {
  const { username, password } = await getRequestBody(request);
  const user = state.users.find(
    (item) => item.username === username && item.password === password,
  );

  if (!user) {
    sendJson(response, 401, { message: 'Usuario o contrasena incorrectos.' });
    return;
  }

  sendJson(response, 200, {
    token: createToken(user),
    user: {
      id: user.id,
      username: user.username,
    },
  });
}

function handleListCourses(request, response) {
  if (!requireAuth(request, response)) {
    return;
  }

  sendJson(response, 200, state.courses);
}

async function handleCreateCourse(request, response) {
  if (!requireAuth(request, response)) {
    return;
  }

  const { name, animal, description } = await getRequestBody(request);

  if (!name || !animal) {
    sendJson(response, 400, {
      message: 'El nombre del curso y el animal son obligatorios.',
    });
    return;
  }

  const course = {
    id: state.courses.length + 1,
    name: name.trim(),
    animal: animal.trim(),
    description: (description || '').trim(),
  };

  state.courses.push(course);
  sendJson(response, 201, course);
}

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  if (method === 'OPTIONS') {
    sendJson(response, 204, null);
    return;
  }

  try {
    if (method === 'POST' && url === '/auth/api/auth/login') {
      await handleLogin(request, response);
      return;
    }

    if (method === 'GET' && url === '/auth/api/courses') {
      handleListCourses(request, response);
      return;
    }

    if (method === 'POST' && url === '/auth/api/courses') {
      await handleCreateCourse(request, response);
      return;
    }

    sendJson(response, 404, { message: 'Ruta no encontrada.' });
  } catch (error) {
    sendJson(response, 500, { message: error.message || 'Error interno.' });
  }
});

server.listen(PORT, () => {
  console.log(`Backend listo en http://localhost:${PORT}/auth`);
  console.log('Usuario de prueba: admin');
  console.log('Contrasena de prueba: 123456');
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`El puerto ${PORT} ya esta ocupado.`);
    console.error('Probablemente el backend ya esta corriendo en otra terminal.');
    console.error('Solucion 1: cierra la terminal anterior o detén el proceso que usa ese puerto.');
    console.error('Solucion 2: corre el backend en otro puerto con:');
    console.error('PowerShell: $env:PORT=8081; npm run server');
    process.exit(1);
  }

  throw error;
});
