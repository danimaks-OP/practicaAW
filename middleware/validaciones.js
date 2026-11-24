// Comprueba los parámetros de la petición en la ruta antes de llamar al servicio. Si algo no es válido -> next(error 400), si no, next()

import HttpError from "../utils/HttpError.js";

const ORDENES_CURSO = ["fecha_inicio", "-fecha_inicio", "nombre", "-nombre", "plazas", "-plazas"];

export function validarId(req, res, next) {
  const texto = req.params.id;
  if (!/^\d+$/.test(texto) || Number(texto) <= 0)return next(new HttpError(400, "El identificador del curso no es válido"));

  next();
}

export function validarFiltrosCursos(req, res, next) {
  const { nombre = "", disponibles, sort = "fecha_inicio" } = req.query;
  const campos = {};
  if (typeof nombre !== "string" || nombre.trim().length > 100) {
    campos.nombre = "El texto de búsqueda no puede superar los 100 caracteres";
  }
  if (disponibles !== undefined && disponibles !== "true" && disponibles !== "false") {
    campos.disponibles = "disponibles debe ser true o false";
  }
  if (!ORDENES_CURSO.includes(sort)) {
    campos.sort = `Ordenación no permitida. Valores posibles: ${ORDENES_CURSO.join(", ")}`;
  }
  if (Object.keys(campos).length > 0) {
    return next(new HttpError(400, "Datos no válidos", campos));
  }
  req.filtros = {nombre: nombre.trim(), disponibles: disponibles === "true", sort};
  next();
}
