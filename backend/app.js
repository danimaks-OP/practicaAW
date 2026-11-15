"use strict"

// IMPORTACIÓN DE MÓDULOS ("require" carga un modulo y devuelve lo que exporta)
// Módulos core de Node.js
const path = require("path"); // Manejo de rutas de ficheros
const fs = require("fs"); // Para leer y escribir ficheros
const os = require("os"); // Info. del SO
// Módulo propio
const courses = require("./modules/courses");

// __dirname = carpeta de este fichero -> asi funciona se ejecute donde se ejecute
const dataFile = path.join(__dirname, "data", "courses.json");

/* Posición	     Contenido con node app.js ingl
     [0]	       Ruta del ejecutable de Node
     [1]	             Ruta de app.js
     [2]	              ej: "ingl"
*/
const search = process.argv[2]; // Se lee el argumento [2] de la terminal 

//Texto a mostrar
console.log("Centro de Formación - backend");
console.log(
  `Node.js ${process.version} en ${os.platform()} (${os.hostname()})`,
);
console.log(`Leyendo ${path.basename(dataFile)}...`);

fs.readFile(dataFile, { encoding: "utf-8" }, (err, content) => {
  if (err) {
    console.error("No se pudo leer el fichero de cursos:", err.message);
    process.exitCode = 1;
    return;
  }

  let catalog;
  try {
    catalog = JSON.parse(content);
  } catch (e) {
    console.error(
      "El fichero de cursos no contiene un JSON valido:",
      e.message,
    );
    process.exitCode = 1;
    return;
  }

  if (!courses.isValidCatalog(catalog)) {
    console.error("El fichero de cursos no tiene el formato esperado");
    process.exitCode = 1;
    return;
  }

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
      Plazas: c.places == 0 ? "Completo" : c.places,
    })),
  );

  console.log(
    `Total: ${catalog.length} cursos, ` +
      `${courses.withPlaces(catalog).length} con plazas, ` +
      `${courses.fullCourses(catalog).length} completos`,
  );
});

// Sale ANTES que la tabla porque readFile es asíncrono
console.log("(lectura en curso...)");