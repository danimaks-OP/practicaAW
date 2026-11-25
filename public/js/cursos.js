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
        if (filter_type === "full" && plazas_libres <= 0)
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


// Carga de cursos

function loadCourses() {

    showLoadingTable();

    fetch('/api/cursos').then(async r => {
        if (!r.ok) {
            throw new Error('Error HTTP');
        }
        courses = await r.json();
        drawTable();
    }).catch((e) => {
        console.warn(e);
        showErrorTable('No se pudo cargar el catálogo');
    });
}


// Inicializar cursos

loadCourses();


// Modal

function showModal(title, info){
    document.getElementById("statusTitle").textContent = title;
    document.getElementById("statusInfo").textContent = info;
    bootstrap.Modal.getOrCreateInstance(document.getElementById("statusModal")).show();
}


// Formulario añadir cursos

const form = document.getElementById("course_form");

const name = form["name_course"];
const places = form["places_course"];
const id_docente = form["id_docente"];
const id_aula = form["id_aula"];
const init_date = form["init_date"];
const end_date = form["end_date"];
const description = form["description_course"];
const schedule = form["schedule"];

const inputs = [name, places, id_docente, id_aula, init_date, end_date, description, schedule];
inputs.forEach((elem) => elem.addEventListener("input", () => elem.setCustomValidity("")));

init_date.addEventListener("input", () => end_date.setCustomValidity(""));
end_date.addEventListener("input", () => init_date.setCustomValidity(""));

form.addEventListener("submit", async function(e) {
    e.preventDefault();

    if (name.value.trim() === "")
        name.setCustomValidity("El nombre no puede estar vacío");

    if (places.value === "" || Number(places.value) < 1)
        places.setCustomValidity("Las plazas deben ser un número mayor o igual a 1");

    if (id_docente.value === "" || Number(id_docente.value) <= 0 || !Number.isInteger(Number(id_docente.value)))
        id_docente.setCustomValidity("El ID del docente debe ser un entero positivo");

    if (id_aula.value === "" || Number(id_aula.value) <= 0 || !Number.isInteger(Number(id_aula.value)))
        id_aula.setCustomValidity("El ID del aula debe ser un entero positivo");

    if (init_date.value === "")
        init_date.setCustomValidity("La fecha de inicio es obligatoria");

    if (end_date.value === "")
        end_date.setCustomValidity("La fecha de fin es obligatoria");

    if (init_date.value !== "" && end_date.value !== "" && init_date.value > end_date.value)
        end_date.setCustomValidity("La fecha de fin no puede ser anterior a la fecha de inicio");

    if (!form.reportValidity()) return;

    let course = {
        nombre: name.value.trim(),
        id_docente: Number(id_docente.value),
        id_aula: Number(id_aula.value),
        plazas: Number(places.value),
        fecha_inicio: init_date.value,
        fecha_fin: end_date.value,
    };

    if(description.value.trim() !== "")
        course.descripcion = description.value.trim();

    if(schedule.value.trim() !== "")
        course.horario = schedule.value.trim();

    let res;
    try{
        res = await fetch('/api/cursos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(course)
    });
    }catch(e){
        showModal("ERROR", "No se ha podido insertar el curso por un error en la conexión");
        return;
    }

    if(!res.ok){
        const error_data = await res.json();
        showModal("ERROR", `Se ha producido un error al intentar insertar el curso: ${error_data.error}`);
        return;
    }

    showModal("Éxito", "Se ha insertado el curso con éxito");

    loadCourses();

    form.reset();
});