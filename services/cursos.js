import db from '../db/mariadb.js';

async function listar() {
    try{
        let cursos = await db.query("SELECT c.id_curso, d.nombre AS docente, a.nombre AS aula, c.nombre, c.descripcion, c.fecha_inicio, c.fecha_fin, c.horario, c.plazas, c.estado, (SELECT COUNT(*) FROM matriculas m WHERE m.id_curso = c.id_curso AND m.estado = 'activa') as matriculados FROM cursos c LEFT JOIN docentes d ON c.id_docente = d.id_docente LEFT JOIN aulas a ON a.id_aula = c.id_aula");
        cursos = cursos.map(curso => ({...curso, matriculados: Number(curso.matriculados)}));
        return cursos;
    }catch(e){
        console.log(e);
        throw new Error("Ha ocurrido un error al consultar la base de datos");
    }
}

export default { listar };