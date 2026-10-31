let form = document.getElementById('register_form');

let name = form['reg_name'];
let email = form['reg_email'];
let passwd = form['reg_passwd'];
let passwd_conf = form['reg_conf_passwd'];

let inputs = [name, email, passwd, passwd_conf];
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

    if (name.value.trim() === "") {
        report_input(name, "El nombre no puede ser un campo vacío");
    } else if (name.value.trim().length < 2 || name.value.trim().length > 64) {
        report_input(name, "El nombre debe tener entre 2 y 64 caracteres");
    }

    if (email.value.trim() === "") {
        report_input(email, "El correo electrónico no puede ser un campo vacío");
    } else if (email.validity.typeMismatch) {
        report_input(email, "Formato de correo electrónico incorrecto");
    }

    if (passwd.value == ""){
        report_input(email, "La contraseña no puede ser un campo vacío");
    }else if (passwd.value.length < 8 || passwd.value.length > 64) {
        report_input(passwd, "La contraseña debe tener entre 8 y 64 caracteres");
    }else if(!passwd.value.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).+$/)){
        report_input(passwd, "La contraseña debe contener letras, numeros y al menos un caracter especial");
    }

    if (passwd.value !== passwd_conf.value) {
        report_input(passwd_conf, "Las contaseñas deben de coincidir");
    }

    if (!form.checkValidity()) return;

    document.getElementById("regModalName").textContent = name.value;
    document.getElementById("regModalEmail").textContent = email.value;

    const modal = new bootstrap.Modal(document.getElementById("successRegisterModal"));
    modal.show();
});