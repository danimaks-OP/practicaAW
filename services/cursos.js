// SERVICIO DE CURSOS <-> lógica de negocio
// Recibe datos ya validados por la ruta, pide las filas a la capa de datos y prepara el resultado

import * as cursosDb from "../db/cursos.js";
import HttpError from "../utils/HttpError.js"

// Añade el campo calculado plazas_libres a cada curso
// con ... se crea un objeto nuevo con todas las propiedades de curso, y ademas la nueva (plazas_libres)
function conPlazasLibres(curso){
    return{...curso, plazas_libres: Math.max(curso.plazas - curso.matriculados, 0)};
}

// GET /api/cursos
export async function listarCursos(filtros){
    const filas = await cursosDb.obtenerCursos({nombre: filtros.nombre, sort: filtros.sort});
    const cursos = filas.map(conPlazasLibres);
    if(filtros.disponibles){
        return cursos.filter((c) => c.estado === "activo" && c.plazas_libres > 0);
    }
    return cursos;
}

// GET /api/cursos/:id
export async function obtenerCurso(id){
    const curso = await cursosDb.obtenerCursosPorId(id);
    if(!curso){
        throw new HttpError(404, `No existe ningún curso con id ${id}`);
    }
    return conPlazasLibres(curso);
}