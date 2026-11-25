import db from '../db/mariadb.js';

function validationError(text){
    const error = new Error(text);
    error.status = 400;
    return error;
}

async function listar() {
    let cursos = await db.query("SELECT c.id_curso, d.nombre AS docente, a.nombre AS aula, c.nombre, c.descripcion, c.fecha_inicio, c.fecha_fin, c.horario, c.plazas, c.estado, (SELECT COUNT(*) FROM matriculas m WHERE m.id_curso = c.id_curso AND m.estado = 'activa') as matriculados FROM cursos c LEFT JOIN docentes d ON c.id_docente = d.id_docente LEFT JOIN aulas a ON a.id_aula = c.id_aula");
    cursos = cursos.map(curso => ({ ...curso, matriculados: Number(curso.matriculados) }));
    return cursos;
}

function validarFecha(fecha) {
    if (typeof fecha !== 'string') return false;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(fecha)) return false;
    const date = new Date(fecha + 'T00:00:00Z');
    return date.toISOString().slice(0, 10) === fecha;
}

async function insertar(c){

    if (!c || typeof c !== 'object')
        throw validationError("Cuerpo de la petición no válido");

    if (typeof c.nombre !== 'string' || c.nombre.trim() === '')
        throw validationError("El nombre es obligatorio");

    if (!validarFecha(c.fecha_inicio) || !validarFecha(c.fecha_fin))
        throw validationError("Formato de fecha incorrecto");

    if (c.fecha_fin < c.fecha_inicio)
        throw validationError("La fecha de fin no puede ser anterior a la de inicio");
    
    if (!Number.isInteger(c.plazas) || c.plazas <= 0)
        throw validationError("Las plazas deben ser un entero positivo");
    
    if (!Number.isInteger(c.id_docente) || !Number.isInteger(c.id_aula))
        throw validationError("Docente y aula deben ser identificadores numéricos");
   
    const docente = await db.query("SELECT 1 FROM docentes WHERE id_docente = ?", [c.id_docente]);
    const aula = await db.query("SELECT 1 FROM aulas WHERE id_aula = ?", [c.id_aula]);
    
    if(docente.length === 0 || aula.length === 0)
        throw validationError("Docente o aula inexistentes");

    await db.query("INSERT INTO cursos(id_docente, id_aula, nombre, descripcion, fecha_inicio, fecha_fin, horario, plazas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
        [c.id_docente, c.id_aula, c.nombre, c.descripcion ?? null, c.fecha_inicio, c.fecha_fin, c.horario ?? null, c.plazas]);
}

export default { listar, insertar };