const form = document.getElementById("login_form");

const email = form["login_email"];
const passwd = form["login_passwd"];

const inputs = [email, passwd];
inputs.forEach((elem) => elem.addEventListener('input', () => {
    elem.classList.remove('is-invalid');
    elem.parentElement.querySelector('.invalid-feedback').textContent = "";
    
}));

function report_input(input, error) {
    input.classList.add('is-invalid');
    input.parentElement.querySelector('.invalid-feedback').textContent = error;
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

    const firstError = form.querySelector('.is-invalid');
    if (firstError) {
        firstError.focus();
        return;
    }

    // Modal
    document.getElementById("loginModalEmail").textContent = email.value;
    const modal = new bootstrap.Modal(document.getElementById("successLogin"));
    modal.show();
});