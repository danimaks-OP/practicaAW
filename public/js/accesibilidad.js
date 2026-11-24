const theme = document.querySelectorAll("input[name='theme']");
const highContrast = document.getElementById("high_contrast");
const fontSize = document.getElementById("font_size");

theme.forEach((radio) => {
    radio.addEventListener("change", () => {
        if(radio.value === "dark"){
            document.documentElement.classList.add("dark-theme");
            localStorage.setItem("theme", "dark");
        }else{
            document.documentElement.classList.remove("dark-theme");
            localStorage.removeItem("theme");
        }
    });
});

const act_theme = localStorage.getItem("theme") ? localStorage.getItem("theme") : "light";
document.querySelector(`input[name="theme"][value="${act_theme}"]`).checked = true;


highContrast.addEventListener("change", () => {
    if(highContrast.checked){
        document.documentElement.classList.add("high-contrast");
        localStorage.setItem("contrast", "high");   
    }else{
        document.documentElement.classList.remove("high-contrast");
        localStorage.removeItem("contrast");
    }
});

highContrast.checked = localStorage.getItem("contrast") === "high" ? true : false;


fontSize.addEventListener("change", () => {
    if(fontSize.value === "big"){
        document.documentElement.classList.remove("small-fontsize");
        document.documentElement.classList.add("big-fontsize");
        localStorage.setItem("fontsize", "big"); 
    }else if(fontSize.value === "small"){
        document.documentElement.classList.remove("big-fontsize");
        document.documentElement.classList.add("small-fontsize");
        localStorage.setItem("fontsize", "small"); 
    }else{
        document.documentElement.classList.remove("big-fontsize", "small-fontsize");
        localStorage.setItem("fontsize", "medium"); 
    }
});

fontSize.value = localStorage.getItem("fontsize") ? localStorage.getItem("fontsize")  : "medium";