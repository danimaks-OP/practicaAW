let courses = [];

const coursesTable = document.getElementById("courses_tab");
const nCourses = document.getElementById("n_courses");
const statusBox = document.getElementById("courses_status");

// Elegimos que el tipo de filtro se mantenga en local y la busqueda por nombre sea por sesion
let filter_name = sessionStorage.getItem("filter_name") ? sessionStorage.getItem("filter_name") : "";
let filter_type = localStorage.getItem("filter_type") ? localStorage.getItem("filter_type") : "";


function formatDate(iso) {
    if (!iso) return "—";
    const [y, m, d] = iso.slice(0, 10).split("-");
    return `${d}/${m}/${y}`;
}

function createCell(text) {
    const td = document.createElement("td");
    td.textContent = text ?? "—";
    return td;
}

function drawTable() {
    const frag = document.createDocumentFragment();
    const f = filter_name.trim().toLowerCase();

    const filteredCourses = courses.filter((c) =>
        c.nombre.toLowerCase().includes(f) &&
        !(filter_type === "full" && (c.plazas_libres === 0 || c.estado !== "activo"))
    );

    for (const c of filteredCourses) {
        const tr = document.createElement("tr");
        if (c.plazas_libres === 0) tr.classList.add("table-danger");

        tr.append(
            createCell(c.id_curso),
            createCell(c.nombre),
            createCell(c.docente),
            createCell(c.aula),
            createCell(`${formatDate(c.fecha_inicio)} – ${formatDate(c.fecha_fin)}`),
            createCell(c.horario),
            createCell(c.plazas_libres === 0 ? "Completo" : `${c.plazas_libres} de ${c.plazas}`),
            createCell(c.estado === "activo" ? "Activo" : "Inactivo")
        );
        frag.append(tr);
    }

    coursesTable.replaceChildren(frag);
    nCourses.textContent = filteredCourses.length;
}

function mostrarCursos(cursos){
    courses = cursos;
    statusBox.textContent = courses.length === 0 ? "No hay cursos registrados." : "";
    drawTable();
}

// Mostrar mensaje de error y dejar la tabla vacía
function mostrarError(mensaje){
    courses = [];
    statusBox.textContent = mensaje;
    drawTable();
}

// Pide los cursos a la API
function loadCourses(){
    statusBox.textContent = "Cargando cursos...";

    fetch('/api/cursos')
        .then(r => { if(!r.ok) throw new Error("Error HTTP"); return r.json();})
        .then(cursos => mostrarCursos(cursos))
        .catch(() => mostrarError("No se puede cargar el catálogo"));
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

loadCourses();
