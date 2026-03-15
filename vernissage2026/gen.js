document.addEventListener("DOMContentLoaded", function () {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    fetch("artworks.json")
        .then(function (response) {
            if (!response.ok) throw new Error("Failed to load artworks");
            return response.json();
        })
        .then(function (artworks) {
            artworks.forEach(function (artwork) {
                const card = document.createElement("div");
                card.className = "artwork-card";

                const title = document.createElement("h2");
                title.textContent = artwork.title || "Untitled";

                const group = document.createElement("p");
                group.className = "group";
                group.textContent = artwork.group || "";

                const artists = document.createElement("p");
                artists.className = "artists";
                artists.textContent = Array.isArray(artwork.artists)
                    ? artwork.artists.join(", ")
                    : (artwork.artists || "");

                const description = document.createElement("p");
                description.className = "description";
                description.textContent = artwork.description || "";

                card.appendChild(title);
                card.appendChild(group);
                card.appendChild(artists);
                card.appendChild(description);
                gallery.appendChild(card);
            });
        })
        .catch(function (err) {
            gallery.innerHTML = "<p class=\"error\">Could not load artworks. " + err.message + "</p>";
        });
});
