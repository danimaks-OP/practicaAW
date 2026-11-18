import express from "express";
import * as courses from "../modules/courses.js";

// Recibe el array de cursos (en memoria) y devuelve un router con sus rutas
function createCoursesRouter(catalog){
    const router = express.Router();

    // GET /api/cursos                -> todos los cursos
    // GET /api/cursos?nombre=ingl    -> filtrados por nombre
    //GET /api/curos?disponibles=true -> solo los que tienen plazas

    router.get("/", (req, res) => {
        let result = catalog;
        if(typeof req.query.nombre === "string"){
            result = courses.searchByName(result, req.query.nombre);
        }
        if(req.query.disponibles === "true"){
            result = courses.withPlaces(result);
        }
        res.json(result);
    });

    // GET /api/cursos/:id -> un curso concreto
    router.get("/:id", (req, res) => {
        const id = Number(req.params.id);
        const course = catalog.find((c) => c.id === id);
        if(!course){
            return res.status(404).json({error: `No existe ningún curso con id ${req.params.id}`});
        }
        res.json(course);
    });

    // POST /api/cursos -> crea un curso con los datos del cuerpo (JSON)
    router.post("/", (req, res) => {
        const errors = courses.validateCourseData(req.body);
        if(errors.length > 0){
            return res.status(400).json({errores: errors});
        }

        const newCourse = {
            id: courses.nextId(catalog),
            name: req.body.name.trim(),
            category: req.body.category.trim(),
            duration: req.body.duration,
            places: req.body.places
        };
        catalog.push(newCourse);
        res.status(201).json(newCourse);
    });

    return router;
}

export default createCoursesRouter;