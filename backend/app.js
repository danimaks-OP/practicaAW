// IMPORTACIÓN DE MÓDULOS ("import" carga un módulo y trae lo que exporta)
// Módulos nativos de Node.js (prefijo "node:")
import { readFile } from "node:fs/promises"; // Leer ficheros (versión con promesas, se usa con await)
import { join, basename } from "node:path"; // Manejo de rutas de ficheros
// Módulo externo (instalado con npm)
import express from "express";
import { platform, hostname } from "node:os"; // Info. del SO
// Módulo propio (con ES modules la extensión .js es obligatoria)
import * as courses from "./modules/courses.js";
import createCoursesRouter from "./routes/courses.js";

const PORT = 3000;

// import.meta.dirname = carpeta de este fichero -> asi funciona se ejecute donde se ejecute
const dataFile = join(import.meta.dirname, "data", "courses.json");

//Texto a mostrar
console.log("Centro de Formación - backend");
console.log(`Node.js ${process.version} en ${platform()} (${hostname()})`);
console.log(`Leyendo ${basename(dataFile)}...`);

let catalog;
try {
    const text = await readFile(dataFile, "utf8");
    catalog = JSON.parse(text);
} catch (e) {
    // Fichero inexistente o JSON mal formado
    console.error("No se pudieron cargar los cursos:", e.message);
    process.exit(1);
}

if (!courses.isValidCatalog(catalog)) {
    console.error("El fichero de cursos no tiene el formato esperado");
    process.exit(1);
}

const app = express();

// Middleware: convierte el cuerpo JSON de las peticiones en req.body
app.use(express.json());

// Rutas de la API de cursos
app.use("/api/cursos", createCoursesRouter(catalog));

// Cualquier otra ruta: 404 en JSON
app.use((req, res) => {
    res.status(404).json({error: "Ruta no encontrada"});
});

app.use((err, req, res, next) => {
    if(err.type === "entity.parse.failed"){
        return res.status(404).json({error: "El cuerpo de la petición no es un JSON válido"});
    }
    console.error(err);
    res.status(500).json({error: "Error interno del servidor"});
});

app.listen(PORT, (error) =>{
    if(error) {
        console.error("No se pudo arrancar el servidor", error.message);
        process.exit(1);
    }
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
} );
