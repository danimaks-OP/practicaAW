let form = document.getElementById("login_form");

let email = form["login_email"];
let passwd = form["login_passwd"];

let inputs = [email, passwd];
inputs.forEach((elem) => elem.addEventListener('input', () => {
    elem.setCustomValidity("");
    elem.classList.remove('is-invalid');
}));

function report_input(input, error) {
    input.setCustomValidity(error);
    input.classList.add('is-invalid');
    input.nextElementSibling.textContent = error;
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (email.validity.valueMissing) {
        report_input(email, "Por favor, introduzca su correo electrónico");
    } else if (email.validity.typeMismatch || email.validity.patternMismatch) {
        report_input(email, "Formato de correo electrónico incorrecto");
    }

    if (passwd.validity.valueMissing) {
        report_input(passwd, "Por favor, introduzca su contraseña");
    } else if (passwd.validity.tooShort || passwd.validity.tooLong) {
        report_input(passwd, "La contraseña debe tener entre 8 y 64 caracteres");
    }

    if (!form.checkValidity()) return;

    // Modal
    document.getElementById("loginModalEmail").textContent = email.value;
    const modal = new bootstrap.Modal(document.getElementById("successLogin"));
    modal.show();
});