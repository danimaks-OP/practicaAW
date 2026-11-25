// Punto de entrada: crea la aplicaion Express, registra los middleware y las rutas y arranca el servidor

import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import cursosRouter from "./routes/cursos.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares generales
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/api/cursos", cursosRouter);

// 404: ninguna ruta ha respondido
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
})

// 500: errores pasados con next(err)
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: "Error interno del servidor" });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));