import "dotenv/config";
import express from 'express';
import cursosRouter from './routes/cursos.api'

const app = express();

app.use(express.static('./public'));

app.use('/api/cursos', cursosRouter);

app.listen(process.env.PORT, () => console.log(`Servidor desplegado en http://localhost:${process.env.PORT}`))

