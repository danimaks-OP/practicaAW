// Las rutas reciben la peticion http, validan los parámetros, llaman al servicio y envían la respuesta. Los errores se delegan con next(err).

import {Router} from "express";
import * as cursosService from "../services/cursos.service.js";

const router = Router();

// GET /api/cursos -> 200 + array JSON
router.get("/", async(req, res, next) => {
    try{
        const cursos = await cursosService.listar();
        res.json(cursos);
    }catch(err){
        next(err);
    }
});

// GET /api/cursos/:id -> 200 + curso, 400 id no válido, 404 no existe
router.get("/:id", async(req, res, next) =>{
    try{
        const id = Number(req.params.id);
        if(!Number.isInteger(id) || id <= 0) return res.status(400).json({error: "El identificador del curso no es válido"});

        const curso = await cursosService.obtener(id);
        if(!curso) return res.status(404).json({error: `No existe ningún curso con id ${id}`});
        res.json(curso);
    }catch(err){
        next(err);
    }
});

export default router;