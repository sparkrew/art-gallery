(() => {
    const root = document.documentElement;
    const storageKey = "theme";

    const prefersDark = window.matchMedia
        ? window.matchMedia("(prefers-color-scheme: dark)")
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
        toggle.setAttribute("aria-pressed", String(isDark));
        toggle.textContent = isDark ? "Light mode" : "Dark mode";
    };

    applyTheme(getPreferredTheme());

    document.addEventListener("click", (e) => {
        const toggle = e.target.closest("#theme-toggle");
        if (!toggle) return;

        const nextTheme =
            document.documentElement.dataset.theme === "dark"
                ? "light"
                : "dark";

        localStorage.setItem(storageKey, nextTheme);
        applyTheme(nextTheme);
    });

    // React to system theme changes ONLY if user hasn't chosen manually
    if (prefersDark) {
        prefersDark.addEventListener("change", (event) => {
            const stored = localStorage.getItem(storageKey);
            if (stored !== "light" && stored !== "dark") {
                applyTheme(event.matches ? "dark" : "light");
            }
        });
    }
})();
