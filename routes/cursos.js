// Las rutas reciben la peticion http, validan los parámetros, llaman al servicio y envían la respuesta. Los errores se delegan con next(err).

import {Router} from "express";
import * as cursosService from "../services/cursos.js";
import {validarId, validarFiltrosCursos} from "../middleware/validaciones.js"

const router = Router();

// GET /api/cursos?nombre=&disponibles=&sort -> 200 + array JSON
router.get("/", validarFiltrosCursos, async(req, res, next) => {
    try{
        const cursos = await cursosService.listarCursos(req.filtros);
        res.json(cursos);
    }catch(err){
        next(err);
    }
});

// GET /api/cursos:id -> 200 + curso, 400 id no válido, 404 no existe
router.get("/:id", validarId, async(req, res, next) =>{
    try{
        const curso = await cursosService.obtenerCurso(Number(req.params.id));
        res.json(curso);
    }catch(err){
        next(err);
    }
});

export default router;