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

export { isValidCatalog, searchByName, withPlaces, fullCourses }; // Esto consigue que se pueda usar desde fuera