const form = document.getElementById("contact_form");

const reason = form["reason"];
const matter = form["matter"];
const message = form["message"];

const inputs = [reason, matter, message];
inputs.forEach((elem) => elem.addEventListener('input', () => {
    elem.classList.remove('is-invalid');
    elem.parentElement.querySelector('.invalid-feedback').textContent = "";
}));

function report_input(input, error) {
    input.classList.add('is-invalid');
    input.parentElement.querySelector('.invalid-feedback').textContent = error;
}

form.addEventListener("submit", function(e) {
    e.preventDefault();

    if (matter.validity.valueMissing || matter.value.trim() === "") {
        report_input(matter, "El asunto no puede ser un campo vacío");
    } else if (matter.validity.tooLong) {
        report_input(matter, "El asunto no puede superar los 128 caracteres");
    }

    if (message.validity.valueMissing || message.value.trim() === "") {
        report_input(message, "El mensaje no puede ser un campo vacío");
    } else if (message.validity.tooLong) {
        report_input(message, "El mensaje no puede superar los 1000 caracteres");
    }

    const firstError = form.querySelector('.is-invalid');
    if (firstError) {
        firstError.focus();
        return;
    }

    // Modal
    document.getElementById("contactModalReason").textContent = reason.value;
    document.getElementById("contactModalMatter").textContent = matter.value;
    document.getElementById("contactModalMessage").textContent = message.value;

    const modal = new bootstrap.Modal(document.getElementById("successContactModal"));
    modal.show();
});