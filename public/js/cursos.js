let courses = [];

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


function createTableData(tr, text){
    const td = document.createElement("td");
    td.textContent = text;
    tr.append(td);
}

function formatDate(date) {
    const [y, m, d] = date.slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
}

function drawTable() {
    const frag = document.createDocumentFragment();

    const f = filter_name.trim().toLowerCase();
    const filteredCourses = courses.filter((c) => c.nombre.toLowerCase().includes(f));

    let count = 0;
    for (const c of filteredCourses) {
        const plazas_libres = c.plazas - c.matriculados;
        if (filter_type === "full" && plazas_libres === 0)
            continue;
        const tr = document.createElement("tr");

        createTableData(tr, c.id_curso);
        createTableData(tr, c.nombre);
        createTableData(tr, c.descripcion);
        createTableData(tr, c.docente);
        createTableData(tr, c.aula);
        createTableData(tr, `${formatDate(c.fecha_inicio)} - ${formatDate(c.fecha_fin)}`);
        createTableData(tr, c.horario);

        if((plazas_libres === 0)) tr.classList.add("table-danger");
        createTableData(tr, (plazas_libres === 0) ? "Completo" : `${plazas_libres}/${c.plazas}`);

        createTableData(tr, c.estado);
        if(c.estado === "activo"){
            tr.append(createDeleteButton(c.id_curso));
        }else{
            createTableData(tr, "");
        }
        
        frag.append(tr);
        count++;
    }

    coursesTable.replaceChildren(frag);
    nCourses.textContent = count;
}

function showErrorTable(error){
    const tr = document.createElement("tr");
    tr.classList.add("table-danger");
    const td = document.createElement("td");
    td.setAttribute("colspan", "10");
    td.textContent = error;
    tr.append(td);
    coursesTable.replaceChildren(tr);
    nCourses.textContent = "-";
}

function showLoadingTable(){
    const tr = document.createElement("tr");
    tr.classList.add("table-info");
    const td = document.createElement("td");
    td.setAttribute("colspan", "10");
    td.textContent = "Cargando...";
    tr.append(td);
    coursesTable.replaceChildren(tr);
    nCourses.textContent = "-";
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


// Inicializacion cursos

showLoadingTable();

fetch('/api/cursos').then(async r => {
    if(!r.ok){
        throw new Error('Error HTTP');
    }
    courses = await r.json();
    drawTable();
}).catch((e) => {
    console.warn(e);
    showErrorTable('No se pudo cargar el catálogo');
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