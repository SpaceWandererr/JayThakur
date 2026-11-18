// ========================================
// THEME TOGGLE
// ========================================

const themeToggle = document.querySelector(".theme-toggle");
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("portfolio-theme", theme);

  if (themeToggle) {
    const isDark = theme === "dark";

    themeToggle.textContent = isDark ? "☾" : "☼";

    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );

    themeToggle.setAttribute(
      "title",
      isDark ? "Switch to light mode" : "Switch to dark mode",
    );
  }
}

// Load saved theme (dark by default)
const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
applyTheme(savedTheme);

// Toggle theme on click
themeToggle?.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme") || "dark";

  const newTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(newTheme);
});

// Work page footer year
const workYear = document.querySelector("#work-year");

if (workYear) {
  workYear.textContent = new Date().getFullYear();
}
