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
    drawTable(courses);
}

function addDeleteButton(tr, coursesArray, c) {
    const btn = document.createElement("button");
    btn.textContent = "Eliminar";
    btn.classList.add("btn", "btn-danger");
    btn.addEventListener("click", () => deleteCourse(coursesArray[c].id));
    const td_btn = document.createElement("td");
    td_btn.append(btn);
    tr.append(td_btn);
}

const coursesTable = document.getElementById("courses_tab");
const nCourses = document.getElementById("n_courses");

function drawTable(coursesArray) {
    const frag = document.createDocumentFragment();

    const filter = localStorage.getItem("filter") ? localStorage.getItem("filter") : "none";

    for (const c in coursesArray) {
        if(filter === "full" && coursesArray[c].places === 0) continue;
        const tr = document.createElement("tr");
        for (const k in coursesArray[c]) {
            const td = document.createElement("td");
            if (k === "places" && coursesArray[c][k] === 0) {
                td.textContent = "Completo";
                tr.classList.add("table-danger");
            } else {
                td.textContent = coursesArray[c][k];
            }
            tr.append(td);
        }
        addDeleteButton(tr, coursesArray, c);
        frag.append(tr);
    }

    coursesTable.replaceChildren(frag);
    nCourses.textContent = coursesArray.length;
}


// Inicializacion

const savedCourses = localStorage.getItem("courses");
courses = savedCourses ? JSON.parse(savedCourses) : courses;
drawTable(courses);


// Filtrar nombre de cursos

const search = document.getElementById("search_course");

function filterByName(searchValue) {
    const val = searchValue.trim().toLowerCase();
    const filteredCourses = courses.filter((c) => c.name.toLowerCase().includes(val));
    try {
        sessionStorage.setItem("search", searchValue);
    }catch(err){
        console.warn("No se pudo guardar la búsqueda en sessionStorage: ", err);
    }
    drawTable(filteredCourses);
}

search.addEventListener("input", () => filterByName(search.value));

search.value = sessionStorage.getItem("search") ? sessionStorage.getItem("search") : "";
filterByName(search.value);


// Filtrar cursos

const filter_courses = document.getElementById("filter_courses");
filter_courses.value = localStorage.getItem("filter") ? localStorage.getItem("filter") : "none";

filter_courses.addEventListener("change", function(e){
    try {
        localStorage.setItem("filter", filter_courses.value);
    }catch(err){
        console.warn("No se pudo guardar el filtro en localStorage: ", err);
    }
    drawTable(courses);
});


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