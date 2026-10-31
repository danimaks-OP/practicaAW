let form = document.getElementById("contact_form");

let name = form["u_name"];
let surname = form["surname"];
let email = form["u_email"];
let reason = form["reason"];
let matter = form["matter"];
let message = form["message"];

let inputs = [name, surname, email, matter, message];
inputs.forEach((elem) => elem.addEventListener('input', () => {
    elem.setCustomValidity("");
    elem.classList.remove('is-invalid');
}));

function report_input(input, error) {
    input.setCustomValidity(error);
    input.classList.add('is-invalid');
    input.nextElementSibling.textContent = error;
    input.reportValidity();
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    if (name.value.trim() === "") {
        report_input(name, "El nombre no puede ser un campo vacío");
    } else if (name.value.trim().length < 2 || name.value.trim().length > 32) {
        report_input(name, "El nombre debe tener entre 2 y 32 caracteres");
    }

    if(surname.value !== "" && (surname.value.trim() === "" || surname.value.trim().length < 2 || surname.value.trim().length > 32)){
        report_input(surname, "El apellido debe tener entre 2 y 32 caracteres");
    }

    if (email.value.trim() === "") {
        report_input(email, "El correo electrónico no puede ser un campo vacío");
    } else if (email.validity.typeMismatch) {
        report_input(email, "Formato de correo electrónico incorrecto");
    }

    if (matter.value.trim() === "") {
        report_input(matter, "El asunto no puede ser un campo vacío");
    } else if (matter.value.trim().length < 5 || matter.value.trim().length > 128) {
        report_input(matter, "El asunto debe tener entre 5 y 128 caracteres");
    }

    if (message.value.trim() === "") {
        report_input(message, "El mensaje no puede ser un campo vacío");
    } else if (message.value.trim().length > 1000) {
        report_input(message, "El mensaje no puede superar los 1000 caracteres");
    }

    if(!form.checkValidity()) return;

    // Modal
    document.getElementById("contactModalName").textContent = name.value;
    document.getElementById("contactModalSurname").textContent = surname.value;
    document.getElementById("contactModalEmail").textContent = email.value;
    document.getElementById("contactModalReason").textContent = reason.value;
    document.getElementById("contactModalMatter").textContent = matter.value;
    document.getElementById("contactModalMessage").textContent = message.value;

    const modal = new bootstrap.Modal(document.getElementById("successContactModal"));
    modal.show();
});