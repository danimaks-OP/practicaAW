const form = document.getElementById('register_form');

const name = form['reg_name'];
const email = form['reg_email'];
const passwd = form['reg_passwd'];
const passwd_conf = form['reg_conf_passwd'];

function clear_validity(elem) {
    elem.classList.remove('is-invalid');
    elem.parentElement.querySelector('.invalid-feedback').textContent = "";
}

function report_input(input, error) {
    input.classList.add('is-invalid');
    input.parentElement.querySelector('.invalid-feedback').textContent = error;
}

const inputs = [name, email, passwd, passwd_conf];
inputs.forEach((elem) => elem.addEventListener('input', () => clear_validity(elem)));
passwd.addEventListener('input', () => clear_validity(passwd_conf));

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (name.validity.valueMissing || name.value.trim() === "") {
        report_input(name, "El nombre no puede ser un campo vacío");
    } else if (name.validity.tooLong) {
        report_input(name, "El nombre no puede tener más de 16 caracteres");
    }

    if (email.validity.valueMissing) {
        report_input(email, "El correo electrónico no puede ser un campo vacío");
    } else if (email.validity.typeMismatch || email.validity.patternMismatch) {
        report_input(email, "Formato de correo electrónico incorrecto");
    }

    if (passwd.validity.valueMissing) {
        report_input(passwd, "La contraseña no puede ser un campo vacío");
    } else if (passwd.validity.tooShort || passwd.validity.tooLong) {
        report_input(passwd, "La contraseña debe tener entre 8 y 64 caracteres");
    } else if (passwd.validity.patternMismatch) {
        report_input(passwd, "La contraseña debe contener letras, números y al menos un caracter especial");
    }

    if (passwd.value !== passwd_conf.value) {
        report_input(passwd_conf, "Las contraseñas deben coincidir");
    }

    const firstError = form.querySelector('.is-invalid');
    if (firstError) {
        firstError.focus();
        return;
    }

    // Modal
    document.getElementById("regModalName").textContent = name.value;
    document.getElementById("regModalEmail").textContent = email.value;

    const modal = new bootstrap.Modal(document.getElementById("successRegisterModal"));
    modal.show();
});