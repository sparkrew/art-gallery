function initCountdown() {
    var startDate = new Date(2026, 0, 1);
    var endDate = new Date(2026, 3, 8);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    var totalMs = endDate - startDate;
    var elapsedMs = today - startDate;
    var progress = totalMs <= 0 ? 100 : Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));

    var labelEl = document.getElementById("countdown-label");
    var fillEl = document.getElementById("progress-fill");
    var trackEl = fillEl && fillEl.parentElement;

    if (labelEl) {
        if (today < endDate) {
            var daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));
            labelEl.textContent = daysLeft === 1 ? "1 jour avant le vernissage" : daysLeft + " jours avant le vernissage";
        } else if (today.getTime() === endDate.getTime()) {
            labelEl.textContent = "Today — Vernissage!";
        } else {
            labelEl.textContent = "Vernissage passed";
        }
    }

    if (fillEl) {
        fillEl.style.width = progress + "%";
    }
    if (trackEl) {
        trackEl.setAttribute("aria-valuenow", Math.round(progress));
        if (progress >= 100) {
            trackEl.classList.add("progress-complete");
        } else {
            trackEl.classList.remove("progress-complete");
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    initCountdown();

    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    fetch("artworks.json")
        .then(function (response) {
            if (!response.ok) throw new Error("Failed to load artworks");
            return response.json();
        })
        .then(function (artworks) {
            for (let i = artworks.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [artworks[i], artworks[j]] = [artworks[j], artworks[i]];
            }
            artworks.forEach(function (artwork) {
                const card = document.createElement("div");
                card.className = "artwork-card";

                const title = document.createElement("h2");
                title.textContent = artwork.title || "Untitled";

                const group = document.createElement("p");
                group.className = "group";
                group.textContent = "by "+artwork.group || "";

                // const artists = document.createElement("p");
                // artists.className = "artists";
                // artists.textContent = Array.isArray(artwork.artists)
                //     ? artwork.artists.join(", ")
                //     : (artwork.artists || "");

                const description = document.createElement("p");
                description.className = "description";
                description.textContent = "code: "+artwork.description || "";

                card.appendChild(title);
                card.appendChild(group);
                // card.appendChild(artists);
                card.appendChild(description);
                gallery.appendChild(card);
            });
        })
        .catch(function (err) {
            gallery.innerHTML = "<p class=\"error\">Could not load artworks. " + err.message + "</p>";
        });
});
