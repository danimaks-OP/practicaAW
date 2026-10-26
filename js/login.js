let form_login = document.getElementById("login_form");

let login_email = form_login["login_email"];
let login_passwd = form_login["login_passwd"];

let login_inputs = [login_email, login_passwd];
login_inputs.forEach((elem) => elem.addEventListener('input', () => {
    elem.setCustomValidity("");
    elem.classList.remove('is-invalid');
}));

function report_input(input, error) {
    input.setCustomValidity(error);
    input.classList.add('is-invalid');
    input.reportValidity();
}

form_login.addEventListener("submit", function (e) {
    e.preventDefault();

    if (login_email.value.trim() === "") {
        report_input(login_email, "El correo electrónico no puede ser un campo vacío")
    } else if (login_email.validity.typeMismatch) {
        report_input(login_email, "Formato de correo electrónico incorrecto")
    }

    if (login_passwd.value.length < 8 || login_passwd.value.length > 64) {
        report_input(login_passwd, "La contraseñas tienen entre 8 y 64 caracteres")
    }

    if (!form_login.checkValidity()) return;

    document.getElementById("loginModalEmail").textContent = login_email.value;
    const modal = new bootstrap.Modal(document.getElementById("successLogin"));
    modal.show();
});