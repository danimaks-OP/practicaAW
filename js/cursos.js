const courses = [
    {
        _id: 1,
        name: "Matemáticas",
        category: "Ciencias",
        duration: 60,
        places: 12 
    },
    {
        _id: 2,
        name: "Dibujo técnico",
        category: "Igeniería",
        duration: 120,
        places: 4 
    },
    {
        _id: 3,
        name: "Inglés",
        category: "Idiomas",
        duration: 30,
        places: 20 
    }
]

let tab = document.getElementById("courses_tab");

for(const c in courses){
    const tr = document.createElement("tr");
    for(const i in courses[c]){
        const td = document.createElement("td");
        td.innerText = courses[c][i];
        tr.append(td);
    }
    tab.append(tr);
}