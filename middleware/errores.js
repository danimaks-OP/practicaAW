// Todas las respuestas de error tienen el mismo formato JSON:
//   { "error": "mensaje" }                                     404, 401, 403, 409, 500...
//   { "error": "Datos no válidos", "details": [...], "campos": {...} }   400 de validación
// Nunca se envían al cliente consultas SQL, trazas ni contraseñas: solo se escriben en la consola.
import HttpError from "../utils/HttpError.js";

// Errores del conector que indican que MariaDB no está disponible o mal configurado
const BD_NO_DISPONIBLE = new Set([
    "ER_GET_CONNECTION_TIMEOUT", // el pool no consiguió conexión (MariaDB apagado)
    "ECONNREFUSED",
    "ER_ACCESS_DENIED_ERROR",    // usuario o contraseña de .env incorrectos
    "ER_BAD_DB_ERROR"            // la base de datos no existe
]);

// Ninguna ruta ha respondido -> 404
export function rutaNoEncontrada(req, res) {
    res.status(404).json({ error: "Ruta no encontrada" });
}

// Express lo reconoce como middleware de errores porque tiene 4 parámetros.
// Llegan aquí los errores pasados con next(err).
export function manejarErrores(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }
    // Errores previstos por nuestro código: 400, 401, 403, 404, 409
    if (err instanceof HttpError) {
        const cuerpo = { error: err.message };
        if (err.campos) {
            cuerpo.details = Object.values(err.campos);
            cuerpo.campos = err.campos;
        }
        return res.status(err.status).json(cuerpo);
    }
    // JSON mal formado o demasiado grande en el cuerpo de la petición
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ error: "El cuerpo de la petición no es un JSON válido" });
    }
    if (err.type === "entity.too.large") {
        return res.status(413).json({ error: "Los datos enviados son demasiado grandes" });
    }
    // Errores inesperados: el detalle técnico solo en la consola del servidor
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}:`, err.code ?? "", err.message);
    if (BD_NO_DISPONIBLE.has(err.code)) {
        return res.status(503).json({ error: "La base de datos no está disponible. Inténtalo más tarde." });
    }
    res.status(500).json({ error: "Error interno del servidor" });
}
