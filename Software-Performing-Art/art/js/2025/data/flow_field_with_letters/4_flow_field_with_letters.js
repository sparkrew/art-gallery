var sketch = function (p) {
  let besuText = "";
  let tekuText = "";
  let commonText = "";
  let besuColor;
  let tekuColor;
  let commonColor;

  const noiseScale = 0.01;
  let besuParticles = [];
  let tekuParticles = [];
  let commonParticles = [];
  let currentIteration = 0;

  let width;
  let height;

  p.preload = function () {
    besuText = p.loadStrings(
      "../art/js/2025/data/flow_field_with_letters/data/besu_filtered_dependencies.txt"
    );
    commonText = p.loadStrings(
      "../art/js/2025/data/flow_field_with_letters/data/overlap_with_version-25.1.0.txt"
    );
    tekuText = p.loadStrings(
      "../art/js/2025/data/flow_field_with_letters/data/teku_filtered_dependencies.txt"
    );
  };

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    p.colorMode(p.HSB);
    p.background(0, 0, 0);

    besuText = besuText.join(" ");
    commonText = commonText.join(" ");
    tekuText = tekuText.join(" ");

    besuColor = p.color(320, 100, 100);
    commonColor = p.color(50, 100, 100);
    tekuColor = p.color(200, 100, 100);

    let clusterHeight = p.height / 6;
    let spacing = p.height / 4;

    // Besu
    for (let i = 0; i < besuText.length; i++) {
      besuParticles.push({
        pos: p.createVector(
          p.random(p.width),
          p.random(spacing - clusterHeight, spacing + clusterHeight)
        ),
        col: besuColor,
        letter: besuText[i],
      });
    }

    // Common
    for (let i = 0; i < commonText.length; i++) {
      commonParticles.push({
        pos: p.createVector(
          p.random(p.width),
          p.random(2 * spacing - clusterHeight, 2 * spacing + clusterHeight)
        ),
        col: commonColor,
        letter: commonText[i],
      });
    }

    // Teku
    for (let i = 0; i < tekuText.length; i++) {
      tekuParticles.push({
        pos: p.createVector(
          p.random(p.width),
          p.random(3 * spacing - clusterHeight, 3 * spacing + clusterHeight)
        ),
        col: tekuColor,
        letter: tekuText[i],
      });
    }
  };

  p.draw = function () {
    if (currentIteration === 1) {
      drawParticles(currentIteration);
      currentIteration++;
      return;
    } else if (currentIteration < 80) {
      currentIteration++;
      return;
    }
    p.background(0, 0, 0, 0.01);
    drawParticles(currentIteration);
  };

  function drawParticles(i) {
    for (let pObj of besuParticles) {
      p.stroke(pObj.col);
      p.fill(0);
      p.text(pObj.letter, pObj.pos.x, pObj.pos.y);
      updateParticle(pObj);
    }

    for (let pObj of commonParticles) {
      p.stroke(pObj.col);
      p.fill(0);
      p.text(pObj.letter, pObj.pos.x, pObj.pos.y);
      updateParticle(pObj);
    }

    for (let pObj of tekuParticles) {
      p.stroke(pObj.col);
      p.fill(0);
      p.text(pObj.letter, pObj.pos.x, pObj.pos.y);
      updateParticle(pObj);
    }
  }

  function updateParticle(pObj) {
    let n = p.noise(pObj.pos.x * noiseScale, pObj.pos.y * noiseScale);
    let a = p.TAU * n;
    pObj.pos.x += p.cos(a);
    pObj.pos.y += p.sin(a);

    if (!onScreen(pObj.pos)) {
      pObj.pos.x = p.random(p.width);
      pObj.pos.y = p.random(p.height);
    }
  }

  function onScreen(v) {
    return v.x >= 0 && v.x <= p.width && v.y >= 0 && v.y <= p.height;
  }
};
