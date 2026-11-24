// Punto de entrada: crea la aplicaion Express, registra los middleware y las rutas y arranca el servidor

import "dotenv/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pool from "./db/mariadb.js";
import cursosRouter from "./routes/cursos.js";
import {rutaNoEncontrada, manejarErrores} from "./middleware/errores.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT ?? 3000);

const app = express();

// 1. Middlewares generales
app.use(helmet({
    contentSecurityPolicy: { directives: { "upgrade-insecure-requests": null } }
}));
app.use(morgan("dev"));        // registro de peticiones en la consola: GET /api/cursos 200 12 ms
app.use(express.json());       // cuerpo JSON -> req.body

// 2. Recursos estáticos
app.use(express.static(path.join(__dirname, "public")));

// 3. API REST
app.use("/api/cursos", cursosRouter);

// 4. 404 y errores (siempre al final)
app.use(rutaNoEncontrada);
app.use(manejarErrores);

app.listen(PORT, async() => {
    console.log(`Servidor en http://localhost:${PORT}`);

    try{
        await pool.query("SELECT 1");
        console.log(`Conectado a MariaDB (base de datos ${process.env.DB_NAME ?? "aw_practica"})`)
    }catch(err){
        console.error("AVISO: no se pudo conectar con MariaDB:", err.code ?? err.message);
        console.error("Comprueba que MariaDB está iniciado en XAMPP y los datos del archivo .env");
    }
})

process.on("SIGINT", async() =>{
    await pool.end();
    process.exit();
})