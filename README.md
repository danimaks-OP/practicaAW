# Centro de Formación

Práctica de Aplicaciones Web — Daniel Maksymiv y Guillermo Patiño.

## Estructura

- Raíz del proyecto: frontend (HTML, CSS y JavaScript del navegador).
- `backend/`: servidor con Node.js y Express.
  - `app.js`: punto de entrada; configura Express y arranca el servidor.
  - `routes/courses.js`: rutas de la API de cursos.
  - `modules/courses.js`: validación y filtrado de cursos.
  - `data/courses.json`: cursos iniciales.
  - `pruebas.http`: peticiones de ejemplo para probar la API.

## Backend

### Requisitos

Node.js en versión LTS (20.11 o superior), que incluye npm. Para comprobar la instalación:

```
node --version
npm --version
```

### Instalación de dependencias

```
cd backend
npm install
```

Instala Express a partir de `package.json` y `package-lock.json`. La carpeta `node_modules` no se sube al repositorio.

### Ejecución

```
npm start
```

El servidor queda escuchando en `http://localhost:3000`. Se detiene con `Ctrl+C`.

En desarrollo, `npm run dev` reinicia el servidor automáticamente al guardar cambios.

### API REST

| Método | Ruta | Descripción | Respuesta |
|---|---|---|---|
| GET | `/api/cursos` | Lista todos los cursos | 200 |
| GET | `/api/cursos?nombre=ingl` | Filtra por nombre | 200 |
| GET | `/api/cursos?disponibles=true` | Solo cursos con plazas | 200 |
| GET | `/api/cursos/:id` | Un curso concreto | 200, o 404 si no existe |
| POST | `/api/cursos` | Crea un curso | 201, o 400 si los datos no son válidos |

Cuerpo del POST (JSON):

```json
{ "name": "Python", "category": "Informática", "duration": 90, "places": 15 }
```

Los datos se guardan en memoria: los cursos creados se pierden al reiniciar el servidor.

Para probar las peticiones, abrir `backend/pruebas.http` en VS Code con la extensión REST Client y pulsar "Send Request" encima de cada una.