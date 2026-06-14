const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
const styleSwitcher = document.querySelector(".style-switcher");
const alternateStyles = document.querySelectorAll(".alternate-style");
const colorSwatches = document.querySelectorAll(".style-switcher .colors span");

styleSwitcherToggle.addEventListener("click", () => {
    styleSwitcher.classList.toggle("open");
});

window.addEventListener("scroll", () => {
    if (styleSwitcher.classList.contains("open")) {
        styleSwitcher.classList.remove("open");
    }
});

function setActiveStyle(color) {
    alternateStyles.forEach((style) => {
        if (color === style.getAttribute("title")) {
            style.removeAttribute("disabled");
        } else {
            style.setAttribute("disabled", "true");
        }
    });

    colorSwatches.forEach((swatch) => {
        swatch.classList.toggle("active", swatch.classList.contains(color));
    });

    localStorage.setItem("portfolio-color", color);
}

window.setActiveStyle = setActiveStyle;

const dayNight = document.querySelector(".day-night");
dayNight.addEventListener("click", () => {
    dayNight.querySelector("i").classList.toggle("fa-sun");
    dayNight.querySelector("i").classList.toggle("fa-moon");
    document.body.classList.toggle("dark");
    localStorage.setItem("portfolio-dark", document.body.classList.contains("dark"));
});

window.addEventListener("load", () => {
    const savedColor = localStorage.getItem("portfolio-color") || "color-1";
    setActiveStyle(savedColor);

    const savedDark = localStorage.getItem("portfolio-dark") === "true";
    if (savedDark) {
        document.body.classList.add("dark");
        dayNight.querySelector("i").classList.add("fa-sun");
        dayNight.querySelector("i").classList.remove("fa-moon");
    } else {
        dayNight.querySelector("i").classList.add("fa-moon");
        dayNight.querySelector("i").classList.remove("fa-sun");
    }
});
