import { Router } from 'express';
import cursosService from '../services/cursos.js'

const router = Router();

router.get('/', async (req, res, next) => {
    try{
        const cursos = await cursosService.listar();
        res.json(cursos);
    }catch(e){
        next(e);
    }
});

router.post('/', async (req, res, next) => {
    try{
        await cursosService.insertar(req.body);
        res.sendStatus(201);
    }catch(e){
        next(e);
    }
});

export default router;