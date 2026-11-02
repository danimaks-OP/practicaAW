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

const coursesTable = document.getElementById("courses_tab");
const nCourses = document.getElementById("n_courses");

function addDeleteButton(tr, coursesArray, c){
    const btn = document.createElement("button");
        btn.textContent = "Eliminar";
        btn.classList.add("btn", "btn-danger");
        btn.addEventListener("click", function () {
            const index = courses.findIndex((elem) => elem.id === coursesArray[c].id);
            courses.splice(index, 1);
            drawTable(courses);
        });
        const td_btn = document.createElement("td");
        td_btn.append(btn);
        tr.append(td_btn);
}

function drawTable(coursesArray) {
    const frag = document.createDocumentFragment();

    for (const c in coursesArray) {
        const tr = document.createElement("tr");
        for (const k in coursesArray[c]) {
            const td = document.createElement("td");
            if(k === "places" && coursesArray[c][k] === 0) {
                td.textContent = "Completo";
                tr.classList.add("table-danger");
            }else{
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

drawTable(courses);


// Filtrar cursos

const search = document.getElementById("search_course");

search.addEventListener("input", function () {
    const val = search.value.trim().toLowerCase();
    const filteredCourses = courses.filter((c) => c.name.toLowerCase().includes(val));
    drawTable(filteredCourses);
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
    drawTable(courses);

    form.reset();
});