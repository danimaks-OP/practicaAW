let courses = [
    {
        id: 1,
        name: "Matemáticas",
        category: "Ciencias",
        duration: 60,
        places: 12
    },
    {
        id: 2,
        name: "Dibujo técnico",
        category: "Ingeniería",
        duration: 120,
        places: 4
    },
    {
        id: 3,
        name: "Inglés",
        category: "Idiomas",
        duration: 30,
        places: 20
    }
]

function deleteCourse(id) {
    const index = courses.findIndex((elem) => elem.id === id);
    courses.splice(index, 1);
    try {
        localStorage.setItem("courses", JSON.stringify(courses));
    } catch (e) {
        console.warn("No se pudieron guardar los cursos en localStorage: ", e);
    }
    drawTable();
}

function createDeleteButton(courseId) {
    const btn = document.createElement("button");
    btn.textContent = "Eliminar";
    btn.classList.add("btn", "btn-danger");
    btn.addEventListener("click", () => deleteCourse(courseId));
    const td_btn = document.createElement("td");
    td_btn.append(btn);
    return td_btn;
}

const coursesTable = document.getElementById("courses_tab");
const nCourses = document.getElementById("n_courses");

// Elegimos que el tipo de filtro se mantenga en local y la busqueda por nombre sea por sesion
let filter_name = sessionStorage.getItem("filter_name") ? sessionStorage.getItem("filter_name") : "";
let filter_type = localStorage.getItem("filter_type") ? localStorage.getItem("filter_type") : "";

function drawTable() {
    const frag = document.createDocumentFragment();

    const f = filter_name.trim().toLowerCase();
    const filteredCourses = courses.filter((c) => c.name.toLowerCase().includes(f));

    let count = 0;
    for (const c in filteredCourses) {
        if (filter_type === "full" && filteredCourses[c].places === 0)
            continue;
        const tr = document.createElement("tr");
        for (const k in filteredCourses[c]) {
            const td = document.createElement("td");
            if (k === "places" && filteredCourses[c][k] === 0) {
                td.textContent = "Completo";
                tr.classList.add("table-danger");
            } else {
                td.textContent = filteredCourses[c][k];
            }
            tr.append(td);
        }
        let td_btn = createDeleteButton(filteredCourses[c].id);
        tr.append(td_btn);
        frag.append(tr);
        count++;
    }

    coursesTable.replaceChildren(frag);
    nCourses.textContent = count;
}


// Inicializacion cursos

const savedCourses = localStorage.getItem("courses");
if (savedCourses) {
    try {
        const parsed = JSON.parse(savedCourses);
        if (parsed.every((c) => Number.isInteger(c.id) && c.name && c.category && Number.isInteger(c.duration) && Number.isInteger(c.places))) {
            courses = parsed;
        } else {
            throw new Error("Formato de curso incorrecto");
        }
    } catch (e) {
        console.warn("JSON de cursos guardados incorrecto, se usan los cursos por defecto: ", e);
        localStorage.removeItem("courses");
    }
}


// Filtrar nombre de cursos

const search = document.getElementById("search_course");
search.value = sessionStorage.getItem("filter_name") ? sessionStorage.getItem("filter_name") : "";

search.addEventListener("input", function () {
    filter_name = search.value;
    try {
        sessionStorage.setItem("filter_name", search.value);
    } catch (err) {
        console.warn("No se pudo guardar la búsqueda en sessionStorage: ", err);
    }
    drawTable();
});


// Filtrar cursos

const select_courses = document.getElementById("filter_courses");
select_courses.value = localStorage.getItem("filter_type") ? localStorage.getItem("filter_type") : "";

select_courses.addEventListener("change", function () {
    filter_type = select_courses.value;
    try {
        localStorage.setItem("filter_type", select_courses.value);
    } catch (err) {
        console.warn("No se pudo guardar el filtro en localStorage: ", err);
    }
    drawTable();
});


// Dibujar tabla inicial

drawTable();


// Formulario añadir cursos

const form = document.getElementById("course_form");

const name = form["name_course"];
const category = form["category_course"];
const duration = form["duration_course"];
const places = form["places_course"];

const inputs = [name, category, duration, places];
inputs.forEach((elem) => elem.addEventListener("input", () => elem.setCustomValidity("")));

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (name.value.trim() === "") {
        name.setCustomValidity("El nombre no puede ser un campo vacío");
    }

    if (category.value.trim() === "") {
        category.setCustomValidity("La categoría no puede ser un campo vacío");
    }

    if (!form.reportValidity()) return;

    let course = {
        id: courses.length > 0 ? courses[courses.length - 1].id + 1 : 1,
        name: name.value.trim(),
        category: category.value.trim(),
        duration: parseInt(duration.value),
        places: parseInt(places.value)
    };

    courses.push(course);

    try {
        localStorage.setItem("courses", JSON.stringify(courses));
    } catch (e) {
        console.warn("No se pudieron guardar los cursos en localStorage: ", e);
    }

    drawTable(courses);

    form.reset();
});