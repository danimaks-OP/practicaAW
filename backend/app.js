// IMPORTACIÓN DE MÓDULOS ("import" carga un módulo y trae lo que exporta)
// Módulos nativos de Node.js (prefijo "node:")
import { readFile } from "node:fs/promises"; // Leer ficheros (versión con promesas, se usa con await)
import { join, basename } from "node:path"; // Manejo de rutas de ficheros
import { platform, hostname } from "node:os"; // Info. del SO
// Módulo propio (con ES modules la extensión .js es obligatoria)
import * as courses from "./modules/courses.js";

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

/* Posición	     Contenido con node app.js ingl
     [0]	       Ruta del ejecutable de Node
     [1]	             Ruta de app.js
     [2]	              ej: "ingl"
*/
const search = process.argv[2]; // Se lee el argumento [2] de la terminal 

/*Si se pasó un texto de búsqueda, shown son los cursos filtrados.
  Si no (search es undefined, que cuenta como falso), son todos.*/
const shown = search ? courses.searchByName(catalog, search) : catalog;
if (search) console.log(`\nCursos que contienen "${search}":`);

console.table(
    shown.map((c) => ({ // map crea un array nuevo haciendo que cada curso sea un objeto nuevo con nombres de columna
        ID: c.id,
        Nombre: c.name,
        Categoria: c.category,
        "Duracion (min)": c.duration,
        Plazas: c.places === 0 ? "Completo" : c.places,
    })),
);

console.log(
    `Total: ${catalog.length} cursos, ` +
    `${courses.withPlaces(catalog).length} con plazas, ` +
    `${courses.fullCourses(catalog).length} completos`,
);