let form_reg = document.getElementById('register_form');

let reg_name = form_reg['reg_name'];
let reg_email = form_reg['reg_email'];
let reg_passwd = form_reg['reg_passwd'];
let passwd_conf = form_reg['reg_conf_passwd'];

let reg_inputs = [reg_name, reg_email, reg_passwd, passwd_conf];
reg_inputs.forEach((elem) => elem.addEventListener('input', () => {
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

    if (reg_name.value.trim() === "") {
        report_input(reg_name, "El nombre no puede ser un campo vacío")
    } else if (reg_name.value.trim().length < 2 || reg_name.value.trim().length > 64) {
        report_input(reg_name, "El nombre debe tener entre 2 y 64 caracteres")
    }

    if (reg_email.value.trim() === "") {
        report_input(reg_email, "El correo electrónico no puede ser un campo vacío")
    } else if (reg_email.validity.typeMismatch) {
        report_input(reg_email, "Formato de correo electrónico incorrecto")
    }

    if (reg_passwd.value.length < 8 || reg_passwd.value.length > 64) {
        report_input(reg_passwd, "La contraseña debe tener entre 8 y 64 caracteres")
    }

    if (reg_passwd.value !== passwd_conf.value) {
        report_input(passwd_conf, "Las contaseñas deben de coincidir")
    }

    if (!form_reg.checkValidity()) return;

    document.getElementById("regModalName").textContent = reg_name.value;
    document.getElementById("regModalEmail").textContent = reg_email.value;
    const modal = new bootstrap.Modal(document.getElementById("successRegisterModal"));
    modal.show();
});