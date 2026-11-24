import { Router } from 'express';
import cursosService from '../services/cursos'

const router = Router();

router.get('/', (req, res) => {
    return cursosService.listar();
});

module.exports = router;