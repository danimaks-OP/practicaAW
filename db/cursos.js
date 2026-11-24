// Consultas SQL de la tabla cursos (parte 2/2)

import pool from "./mariadb.js";

const SELECT_CURSOS = `
SELECT c.id_curso, c.nombre, c.descripcion, c.fecha_inicio, c.fecha_fin, c.horario, c.plazas, c.imagen, 
    c.estado, c.id_docente, d.nombre AS docente, c.id_aula, a.nombre AS aula, a.edificio, 
(SELECT COUNT(*) FROM matriculas m WHERE m.id_curso = c.id_curso AND m.estado = 'activa') AS matriculados
FROM cursos c
LEFT JOIN docentes d ON  d.id_docente = c.id_docente 
LEFT JOIN aulas a ON a.id_aula = c.id_aula`;

const ORDEN = {
    nombre: "c.nombre",
    fecha_inicio: "c.fecha_inicio",
    plazas: "c.plazas"
};

// Escapa los comodines % y _
function escaparLike(texto){
    return texto.replace(/[\\%_]/g, "\\$&");
}

export async function obtenerCursos({nombre = "", sort = "fecha_inicio"} = {}){
    let sql = SELECT_CURSOS;
    const parametros = [];
    if(nombre !== ""){
        sql += " WHERE c.nombre LIKE ?";
        parametros.push(`%${escaparLike(nombre)}%`);
    }
    const descendente = sort.startsWith("-");
    const columna = ORDEN[descendente ? sort.slice(1) : sort] ?? ORDEN.fecha_inicio;
    sql += ` ORDER BY ${columna} ${descendente ? "DESC" : "ASC"}, c.nombre`;
    return pool.query(sql, parametros);
}

export async function obtenerCursosPorId(idCurso){
    const filas = await pool.query(SELECT_CURSOS + " WHERE c.id_curso = ?", [idCurso]);
    return filas[0] ?? null;
}