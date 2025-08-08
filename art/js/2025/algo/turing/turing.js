var sketch = function (p) {
  let nombre_case_v = 21;
  let nombre_case_h = 21;
  let grid = [];
  let colonnes, range;
  let caseLargeur, caseHauteur;
  let Scale = 3.0;
  let ScaleFin = 1.0;
  let Compteur = 0;
  let tickSound;
  let lastSound = 0;
  let soundInterval = 1000;
  let width;
  let height;

  /* p.preload = function () {
    tickSound = p.loadSound("../art/js/2025/algo/turing/clock.mp3");
  }; */

  p.setup = function () {
    p.frameRate(30);
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    colonnes = nombre_case_h;
    range = nombre_case_v;
    caseLargeur = p.width / colonnes;
    caseHauteur = p.height / range;
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(caseLargeur * 0.5);

    for (let i = 0; i < range; i++) {
      grid[i] = [];
      for (let j = 0; j < colonnes; j++) {
        grid[i][j] = {
          angle: p.random(p.TWO_PI),
          speed: p.random(-0.05, 0.05),
          char: String.fromCharCode(65 + p.int(p.random(26))),
          couleur: p.random([0, 1]),
        };
      }
    }
  };

  p.draw = function () {
    p.background(255);

    p.push();
    Scale = p.lerp(Scale, ScaleFin, 0.01);
    p.translate(p.width / 2, p.height / 2);
    p.scale(Scale);
    p.translate(-p.width / (2 * Scale), -p.height / (2 * Scale));

    for (let i = 0; i < range; i++) {
      for (let j = 0; j < colonnes; j++) {
        grid[i][j].angle += grid[i][j].speed;
      }
    }

    //playSound();
    Compteur++;
    if (Compteur >= 15) {
      updateGrid();
      Compteur = 0;
    }
    drawGrid();
    p.pop();
  };

  /* function playSound() {
    if (p.millis() - lastSound > soundInterval) {
      tickSound.play();
      lastSound = p.millis();
    }
  } */

  function updateGrid() {
    let newGrid = [];
    for (let i = 0; i < range; i++) {
      newGrid[i] = [];
      for (let j = 0; j < colonnes; j++) {
        let voisins = getLettreVoisins(i, j);
        let newValue = calculerLeNouveauChar(grid[i][j], voisins);
        newGrid[i][j] = {
          angle: grid[i][j].angle,
          speed: grid[i][j].speed + p.random(-0.005, 0.005),
          char: newValue.char,
          couleur: newValue.couleur,
        };
      }
    }
    grid = newGrid;
  }

  function drawGrid() {
    for (let i = 0; i < range; i++) {
      for (let j = 0; j < colonnes; j++) {
        let x = j * caseLargeur + caseLargeur / 2;
        let y = i * caseHauteur + caseHauteur / 2;
        p.push();
        p.translate(x, y);
        if (grid[i][j].couleur == 0) {
          p.noFill();
        }
        p.stroke(0);
        p.ellipse(0, 0, caseLargeur * 0.8);
        p.rotate(grid[i][j].angle);
        p.stroke(0);
        p.fill(0);
        p.triangle(
          caseLargeur * 0.35,
          0,
          caseLargeur * 0.25,
          -5,
          caseLargeur * 0.25,
          5
        );
        p.pop();
        p.fill(0);
        p.noStroke();
        p.text(grid[i][j].char, x, y);
      }
    }
  }

  function getLettreVoisins(i, j) {
    let voisins = [];
    for (let k = -1; k <= 1; k++) {
      for (let l = -1; l <= 1; l++) {
        if (k === 0 && l === 0) continue;
        let case_r = (i + k + range) % range;
        let case_c = (j + l + colonnes) % colonnes;
        voisins.push(grid[case_r][case_c].char);
        voisins.push(grid[case_r][case_c].couleur);
      }
    }
    return voisins;
  }

  function calculerLeNouveauChar(currentChar, voisins) {
    let currentValue = currentChar.char.charCodeAt() - 65;
    let sum = 0;
    let sumCouleur = 0;
    for (let i = 0; i < voisins.length; i += 2) {
      sum += voisins[i].charCodeAt() - 65;
      sumCouleur += voisins[i + 1];
    }
    let average = sum / (voisins.length / 2);
    let newValue = {
      char: String.fromCharCode(65 + p.floor((currentValue + average) % 26)),
      couleur: 0,
    };
    if ((currentChar.couleur == 1 && sumCouleur == 2) || sumCouleur == 3) {
      newValue.couleur = 1;
    }
    return newValue;
  }
};
