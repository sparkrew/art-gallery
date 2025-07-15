// Global variables
let O_widthCanva, O_heightCanva, O_canvas, O_artworksData;
let O_artworkRef;
let O_artReady = false;

async function setup() {
  try {
    const response = await fetch("../art/artworks.json");
    const data = await response.json();
    O_artworksData = data;

    O_artworkRef = O_artworksData[0].ref;
    console.log("Œuvre sélectionnée :", O_artworkRef);
  } catch (error) {
    console.error("Erreur de chargement JSON :", error);
    return;
  }

  const container = document.getElementById("artwork-container");
  O_widthCanva = container.offsetWidth;
  O_heightCanva = container.offsetHeight;
  O_canvas = createCanvas(O_widthCanva, O_heightCanva);
  O_canvas.parent("artwork-container");

  await initAllWorks();
}

async function initAllWorks() {
  try {
    if (
      window[O_artworkRef] &&
      typeof window[O_artworkRef].init === "function"
    ) {
      await window[O_artworkRef].init();
      O_artReady = true;
    } else {
      console.error(
        `L'œuvre "${O_artworkRef}" n'est pas définie ou n'a pas de méthode init().`
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'œuvre :", error);
  }
}

function draw() {
  if (!O_artReady) return;

  if (window[O_artworkRef] && typeof window[O_artworkRef].draw === "function") {
    window[O_artworkRef].draw();
  } else {
    console.error(
      `La méthode draw() de l'œuvre "${O_artworkRef}" est manquante.`
    );
  }
}
