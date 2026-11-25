import "dotenv/config";
import express from 'express';
import cursosRouter from './routes/cursos.api.js';

const app = express();

app.use(express.static('./public'));

app.use('/api/cursos', cursosRouter);

app.use((err, req, res, next) => { res.status(500).json({error: "Error interno del servidor"}); });

app.use((req, res) => { res.status(404).send("<h1>Página no encontrada (Error 404)</h1>"); });

app.listen(process.env.PORT, () => console.log(`Servidor desplegado en http://localhost:${process.env.PORT}`))

