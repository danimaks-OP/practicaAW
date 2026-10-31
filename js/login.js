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
    input.reportValidity();
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (email.value.trim() === "") {
        report_input(email, "El correo electrónico no puede ser un campo vacío");
    } else if (email.validity.typeMismatch) {
        report_input(email, "Formato de correo electrónico incorrecto");
    }

    if (passwd.value.length < 8 || passwd.value.length > 64) {
        report_input(passwd, "La contraseñas tienen entre 8 y 64 caracteres");
    }

    if (!form.checkValidity()) return;

    document.getElementById("loginModalEmail").textContent = email.value;
    const modal = new bootstrap.Modal(document.getElementById("successLogin"));
    modal.show();
});