let form_reg = document.getElementById('register_form');

let u_name = form_reg['reg_name'];
let email = form_reg['reg_email'];
let passwd = form_reg['reg_passwd'];
let passwd_conf = form_reg['reg_conf_passwd'];

let inputs = [u_name, email, passwd, passwd_conf];
inputs.forEach((elem) => elem.addEventListener('input', () => {
    elem.setCustomValidity("");
    elem.classList.remove('is-invalid');
}));

function report_input(input, error) {
    input.setCustomValidity(error);
    input.classList.add('is-invalid');
    input.reportValidity();
}

form_reg.addEventListener("submit", function (e) {
    e.preventDefault();

    if (u_name.value.trim() === "") {
        report_input(u_name, "El nombre no puede ser un campo vacío")
    } else if (u_name.value.trim().length < 2 || u_name.value.trim().length > 64) {
        report_input(u_name, "El nombre debe tener entre 2 y 64 caracteres")
    }

    if (email.value.trim() === "") {
        report_input(email, "El correo electrónico no puede ser un campo vacío")
    } else if (email.validity.typeMismatch) {
        report_input(email, "Formato de correo electrónico incorrecto")
    }

    if (passwd.value.length < 8 || passwd.value.length > 64) {
        report_input(passwd, "La contraseña debe tener entre 8 y 64 caracteres")
    }

    if (passwd.value !== passwd_conf.value) {
        report_input(passwd_conf, "Las contaseñas deben de coincidir")
    }

    if (!form_reg.checkValidity()) return;

    document.getElementById("regModalName").textContent = u_name.value;
    document.getElementById("regModalEmail").textContent = email.value;
    const modal = new bootstrap.Modal(document.getElementById("successRegisterModal"));
    modal.show();
});