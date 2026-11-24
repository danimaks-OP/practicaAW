// Aplica las preferencias de accesibilidad guardadas (tema, contraste y tamaño de letra)
const theme = localStorage.getItem("theme");
const contrast = localStorage.getItem("contrast");
const fontSize = localStorage.getItem("fontsize");

if (theme === "dark")
    document.documentElement.classList.add("dark-theme");

if (contrast === "high")
    document.documentElement.classList.add("high-contrast");

if (fontSize === "big") {
    document.documentElement.classList.add("big-fontsize");
} else if (fontSize === "small") {
    document.documentElement.classList.add("small-fontsize");
}