(() => {
  const root = document.documentElement;
  const storageKey = "theme";
  const prefersDark = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: light)")
    : null;

  const getPreferredTheme = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    return prefersDark && prefersDark.matches ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    const isDark = theme === "dark";
    toggle.setAttribute("aria-pressed", isDark ? "true" : "false");
    toggle.textContent = isDark ? "Light mode" : "Dark mode";
  };

  applyTheme(getPreferredTheme());

  const initToggle = () => {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      localStorage.setItem(storageKey, nextTheme);
      applyTheme(nextTheme);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initToggle);
  } else {
    initToggle();
  }

  if (prefersDark) {
    prefersDark.addEventListener("change", (event) => {
      const stored = localStorage.getItem(storageKey);
      if (stored !== "light" && stored !== "dark") {
        applyTheme(event.matches ? "dark" : "light");
      }
    });
  }
})();
