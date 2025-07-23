class ArtworkManager {
  constructor() {
    this.artworks = [];
    this.currentArtwork = null;
    this.loadedScripts = new Set();
    this.container = document.getElementById("artwork-container");
    this.nameContainer = document.getElementById("artwork-name-container");
    this.artworkList = document.getElementById("artwork-list");

    // Variables globales pour p5.js
    window.O_widthCanva = 0;
    window.O_heightCanva = 0;
    window.O_canvas = null;

    this.init();
  }

  async init() {
    try {
      await this.loadArtworks();
      this.shuffleArtworks();
      this.displayArtworkList();
    } catch (error) {
      console.error("Erreur lors de l'initialisation:", error);
      this.showError("Erreur lors du chargement des œuvres");
    }
  }

  async loadArtworks() {
    const response = await fetch("../art/artworks.json");
    this.artworks = await response.json();
  }

  shuffleArtworks() {
    for (let i = this.artworks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.artworks[i], this.artworks[j]] = [
        this.artworks[j],
        this.artworks[i],
      ];
    }
  }

  displayArtworkList() {
    this.artworkList.innerHTML = "";

    this.artworks.forEach((artwork) => {
      const artworkElement = document.createElement("div");
      artworkElement.className = "artwork-item";
      artworkElement.innerHTML = `
                        <div class="artwork-name">${artwork.name}</div>
                        <div class="artwork-meta">
                            <span>${artwork.artist}</span>
                            <span>${artwork.year}</span>
                        </div>
                        <div class="artwork-type">${artwork.type}</div>
                    `;

      artworkElement.addEventListener("mouseenter", () => {
        this.loadArtwork(artwork);
        this.setActiveArtwork(artworkElement);
      });

      this.artworkList.appendChild(artworkElement);
    });
  }

  setActiveArtwork(element) {
    // Retirer la classe active de tous les éléments
    document.querySelectorAll(".artwork-item").forEach((item) => {
      item.classList.remove("active");
    });
    // Ajouter la classe active à l'élément courant
    element.classList.add("active");
  }

  async loadArtwork(artwork) {
    if (this.currentArtwork && this.currentArtwork.ref === artwork.ref) {
      return; // Déjà chargé
    }

    this.showLoading();
    await this.cleanup();

    try {
      // Charger le script de l'œuvre
      await this.loadScript(artwork.src, artwork.ref);

      // Créer le canvas
      this.createCanvas();

      // Initialiser l'œuvre
      if (window[artwork.ref] && window[artwork.ref].init) {
        window[artwork.ref].init();
        this.currentArtwork = artwork;
        this.hideLoading();

        // Démarrer la boucle d'animation p5.js
        this.startP5Loop(artwork.ref);
      } else {
        throw new Error(`Œuvre ${artwork.ref} non trouvée ou mal formatée`);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'œuvre:", error);
      this.showError(`Erreur lors du chargement de "${artwork.name}"`);
    }
  }

  async loadScript(src, ref) {
    return new Promise((resolve, reject) => {
      if (this.loadedScripts.has(ref)) {
        resolve();
        return;
      }

      // Simuler le chargement du script (remplacez par votre logique réelle)
      // Dans un vrai projet, vous feriez:
      // const script = document.createElement('script');
      // script.src = src;
      // script.onload = () => { this.loadedScripts.add(ref); resolve(); };
      // script.onerror = reject;
      // document.head.appendChild(script);

      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        this.loadedScripts.add(ref);
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  simulateHexGrid() {
    // Simulation simplifiée de hex_grid pour la démo
    window.hex_grid = {
      init: () => {
        console.log("Hex Grid initialisé");
      },
      draw: () => {
        if (window.O_canvas) {
          // Dessiner quelques hexagones colorés
          for (let i = 0; i < 5; i++) {
            fill(Math.random() * 360, 80, 90);
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 20 + Math.random() * 30;

            beginShape();
            for (let angle = 0; angle < TWO_PI; angle += TWO_PI / 6) {
              const vx = x + cos(angle) * size;
              const vy = y + sin(angle) * size;
              vertex(vx, vy);
            }
            endShape(CLOSE);
          }
        }
      },
      cleanup: () => {
        console.log("Hex Grid nettoyé");
      },
    };
  }

  createCanvas() {
    window.O_widthCanva = this.container.offsetWidth;
    window.O_heightCanva = this.container.offsetHeight;

    // Supprimer l'ancien canvas s'il existe
    if (window.O_canvas) {
      window.O_canvas.remove();
    }

    window.O_canvas = createCanvas(window.O_widthCanva, window.O_heightCanva);
    window.O_canvas.parent("artwork-container");
    colorMode(HSB, 360, 100, 100);
  }

  startP5Loop(artworkRef) {
    const artwork = window[artworkRef];
    if (artwork && artwork.draw) {
      window.draw = artwork.draw;
      loop();
    }
  }

  async cleanup() {
    noLoop();

    if (
      this.currentArtwork &&
      window[this.currentArtwork.ref] &&
      window[this.currentArtwork.ref].cleanup
    ) {
      window[this.currentArtwork.ref].cleanup();
    }

    if (window.O_canvas) {
      window.O_canvas.remove();
      window.O_canvas = null;
    }

    this.currentArtwork = null;
  }

  showLoading() {
    this.container.innerHTML =
      '<div class="loading">Chargement de l\'œuvre...</div>';
  }

  hideLoading() {
    const loading = this.container.querySelector(".loading");
    if (loading) {
      loading.remove();
    }
  }

  showError(message) {
    this.container.innerHTML = `<div class="error">${message}</div>`;
  }
}

// Initialisation p5.js globale
function setup() {
  // Setup minimal, le vrai setup sera fait par chaque œuvre
}

function draw() {
  // Draw par défaut, sera remplacé par chaque œuvre
}

// Démarrer le gestionnaire quand le DOM est prêt
document.addEventListener("DOMContentLoaded", () => {
  new ArtworkManager();
});

// Gérer le redimensionnement
window.addEventListener("resize", () => {
  if (window.O_canvas) {
    const container = document.getElementById("artwork-container");
    window.O_widthCanva = container.offsetWidth;
    window.O_heightCanva = container.offsetHeight;
    resizeCanvas(window.O_widthCanva, window.O_heightCanva);
  }
});
