// SERVICIO DE CURSOS <-> lógica de negocio
// Recibe datos ya validados por la ruta, pide las filas a la capa de datos y prepara el resultado

import * as db from "../db/mariadb.js";

const SELECT_CURSOS = `
SELECT c.id_curso, c.nombre, c.descripcion, c.fecha_inicio, c.fecha_fin, c.horario, c.plazas, c.imagen, 
    c.estado, c.id_docente, d.nombre AS docente, c.id_aula, a.nombre AS aula, a.edificio, 
(SELECT COUNT(*) FROM matriculas m WHERE m.id_curso = c.id_curso AND m.estado = 'activa') AS matriculados
FROM cursos c
LEFT JOIN docentes d ON  d.id_docente = c.id_docente 
LEFT JOIN aulas a ON a.id_aula = c.id_aula`;

// Añade el campo calculado plazas_libres a cada curso
// con ... se crea un objeto nuevo con todas las propiedades de curso, y ademas la nueva (plazas_libres)
function conPlazasLibres(curso){
    return{...curso, plazas_libres: Math.max(curso.plazas - curso.matriculados, 0)};
}

// GET /api/cursos
export async function listar(){
    const cursos = await db.query(`${SELECT_CURSOS} ORDER BY c.fecha_inicio, c.nombre`);
    return cursos.map(conPlazasLibres);
}

// GET /api/cursos/:id
export async function obtener(id){
    const filas = await db.query(`${SELECT_CURSOS} WHERE c.id_curso = ?`, [id]);
    return filas.length > 0 ? conPlazasLibres(filas[0]) : null;
}