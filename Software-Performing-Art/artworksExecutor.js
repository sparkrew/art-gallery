// Global variables
let O_widthCanva, O_heightCanva, O_canvas, O_artworksData;
let O_artworkRef;
let O_artworsNumber = 0;
let O_artReady = false;
let O_currentSketch = false;
let O_oldSketch;

const container = document.getElementById("artwork-name-container");

function setup() {
  const container = document.getElementById("artwork-container");
  O_widthCanva = container.offsetWidth;
  O_heightCanva = container.offsetHeight;
  O_canvas = createCanvas(O_widthCanva, O_heightCanva);
  O_canvas.parent("artwork-container");

  loadData().then(() => {
    showArtworks(O_artworksData);
    O_artworsNumber = O_artworksData.length;
    document.getElementById(
      "show-all-filter"
    ).innerHTML += ` (${O_artworsNumber})`;
  });
}

async function loadData() {
  try {
    const response = await fetch("../art/artworks.json");
    const data = await response.json();
    O_artworksData = data;
  } catch (error) {
    console.error("Erreur de chargement JSON :", error);
    return;
  }
}
function showArtworks(artworks) {
  artworks.sort(() => Math.random() - 0.5);
  artworks.forEach((artwork) => showArtwork(artwork));
}
function showArtwork(artwork) {
  const el = document.createElement("p");
  el.className = "artwork";
  el.innerHTML = artwork.name;
  container.appendChild(el);

  el.addEventListener("mouseover", () => {
    O_artworkRef = artwork.ref;

    initWork(artwork);
  });
  /* el.addEventListener("mouseleave", () => {
    console.log("art", artwork);
    window[artwork.ref].cleanup();
  }); */
}
/* function cleanup() {
  if (O_currentSketch == true) {
    artwork.remove();
    O_currentSketch = false;
  }
} */
async function initWork(artwork) {
  try {
    if (window[artwork.ref] && typeof window[artwork.ref].init === "function") {
      if (O_oldSketch) {
        window[O_oldSketch].cleanup();
      }
      await window[artwork.ref].init();
      O_oldSketch = artwork.ref;
      O_artReady = true;
      O_currentSketch = true;
    } else {
      console.error(
        `L'oeuvre "${artwork.ref}" n'est pas définie ou n'a pas de méthode init().`
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'initialisation de l'œuvre :", error);
  }
}

function draw() {
  if (!O_artReady) return;
  console.log(O_artworkRef);
  if (window[O_artworkRef] && typeof window[O_artworkRef].draw === "function") {
    window[O_artworkRef].draw();
  } else {
    console.error(
      `La méthode draw() de l'oeuvre "${O_artworkRef}" est manquante.`
    );
  }
}
