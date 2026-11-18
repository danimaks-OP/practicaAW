function isValidCourse(c){ // Comprobar que c es un curso
    return c !== null && typeof c === "object"
    && Number.isInteger(c.id)
    && typeof c.name === "string" && c.name.trim() !== ""
    && typeof c.category === "string" && c.category.trim() !== ""
    && Number.isInteger(c.duration) && c.duration > 0
    && Number.isInteger(c.places) && c.places >= 0;
}

function isValidCatalog(data){ // para todo el array de cursos, ver que todos los cursos son validos
    return Array.isArray(data) && data.every(isValidCourse);
}

//Devuelve un array con los errores encontrados
function validateCourseData(data){
    if(data === null || typeof data !== "object" || Array.isArray(data)){
        return ["El cuerpo de la petición debe ser un objeto JSON"];
    }
    const errors = [];
    if(typeof data.name !== "string" || data.name.trim() === ""){
        errors.push("name es obligatorio y debe ser texto");
    }
    if(typeof data.category !== "string" || data.category.trim() === ""){
        errors.push("category es obligatorio y debe ser texto");
    }
    if(!Number.isInteger(data.duration) || data.duration <= 0){
        errors.push("duration debe ser un numero entero mayor que 0");
    }
    if(!Number.isInteger(data.places) || data.places < 0){
        errors.push("places debe ser un número entero mayor o igual que 0")
    }
    return errors;
}

// Id mayor + 1 (si no hay cursos, 1)
function nextId(courses){
    return courses.reduce((max, c) => Math.max(max, c.id), 0) + 1;
}

function searchByName(courses, text){
    const t = text.trim().toLowerCase();
    return courses.filter((c) => c.name.toLowerCase().includes(t));
}

function withPlaces(courses){
    return courses.filter((c) => c.places > 0);
}

function fullCourses(courses){
    return courses.filter((c) => c.places === 0);
}

export { isValidCatalog, validateCourseData, nextId, searchByName, withPlaces, fullCourses }; // Esto consigue que se pueda usar desde fuera