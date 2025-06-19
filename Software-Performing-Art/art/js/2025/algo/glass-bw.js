var sketch = function (p) {
  let voronoi;
  let diagram;
  let points = [];
  let centerX, centerY;
  let bounds;
  let expansionRate = 1;
  let maxPoints = 500;
  let delay = 30;
  let lastUpdated = 0;
  let cellColors = {};
  let isRunning = false;
  let startButton;

  let osc;
  let notes = [
    523.25, // C5
    587.33, // D5
    659.25, // E5
    698.46, // F5
    783.99, // G5
    880.0, // A5
    987.77, // B5
    1046.5, // C6
  ];
  let width;
  let height;

  p.setup = function () {
    
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    p.colorMode(p.HSB, 360, 100, 100, 100);
    centerX = p.width / 2;
    centerY = p.height / 2;
    voronoi = new Voronoi();
    bounds = { xl: 0, xr: p.width, yt: 0, yb: p.height };
    startButton = p.createButton("Start");
    startButton.parent("artwork-container");
    startButton.mousePressed(startAudio);

    osc = new p5.Oscillator("sine");
  };

  function startAudio() {
    if (!isRunning) {
      p.getAudioContext()
        .resume()
        .then(() => {
          osc.start();
          osc.amp(0);
          initializeVoronoi();
          startButton.style("display", "none");
          isRunning = true;
        });
    }
  }

  function playNote() {
    let note = p.random(notes);
    osc.freq(note);
    osc.amp(0.2, 0);
    osc.amp(0, 0.1);
  }

  p.draw = function () {
    p.background(255);
    if (isRunning) {
      drawVoronoi();
      controlVoronoi();
    }
  };

  function initializeVoronoi() {
    points = [{ x: centerX, y: centerY }];
    diagram = voronoi.compute(points, bounds);
    assignCellColors();
  }

  function drawVoronoi() {
    if (diagram) {
      for (let cell of diagram.cells) {
        let color = cellColors[cell.site.x + "," + cell.site.y];
        p.fill(color.hue, color.saturation, color.brightness, color.alpha);
        p.stroke(255, 30);
        p.strokeWeight(1);
        p.beginShape();
        for (let halfedge of cell.halfedges) {
          let glitch = p.random(0, 1);
          let startPoint = halfedge.getStartpoint();
          if (glitch < 0.995) {
            p.vertex(startPoint.x, startPoint.y);
          }
        }
        p.endShape(p.CLOSE);
      }
    }
  }

  function controlVoronoi() {
    if (p.frameCount - lastUpdated >= delay && points.length < maxPoints) {
      expandVoronoi();
      lastUpdated = p.frameCount;
    }
  }

  function expandVoronoi() {
    let newPoints = [];
    for (let i = 0; i < expansionRate; i++) {
      if (points.length < maxPoints) {
        let angle = p.random(p.TWO_PI);
        let radius = p.random(points.length) * 2;
        let x = centerX + p.cos(angle) * radius;
        let y = centerY + p.sin(angle) * radius;
        newPoints.push({ x, y });
        playNote();
      }
    }
    points = points.concat(newPoints);
    diagram = voronoi.compute(points, bounds);
    assignCellColors();
  }

  function assignCellColors() {
    for (let cell of diagram.cells) {
      let key = cell.site.x + "," + cell.site.y;
      if (!(key in cellColors)) {
        let bw = p.random() < 0.75 ? 0 : 100;
        cellColors[key] = {
          hue: 0,
          saturation: 0,
          brightness: bw,
          alpha: 100,
        };
      }
    }
  }
};
