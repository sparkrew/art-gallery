var sketch = function (p) {
  let csv;
  let music;
  let data = [];
  let index = 0;
  let speed = 1;
  let i = 0;

  p.preload = function () {
    music = p.loadSound(
      "../art/js/2025/data/watchman/data/MoonlightSonata.mp3"
    );
    csv = p.loadTable(
      "../art/js/2025/data/watchman/data/suicides_stats_clean.csv",
      "csv",
      "header"
    );
  };

  p.setup = function () {
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    p.background(20);

    for (let i = 0; i < csv.getRowCount(); i++) {
      let year = p.int(csv.getString(i, "year"));
      let sex = csv.getString(i, "sex");
      let age = csv.getString(i, "age");
      let nombre_succide = csv.getString(i, "suicides_no");

      data.push({
        year: year,
        sex: sex,
        age: age,
        nombre_succide: nombre_succide,
      });
    }

    drawSmileYellow();
    drawSmilePink();
  };

  p.mousePressed = function () {
    if (!music.isPlaying()) {
      music.play();
    }
  };

  p.draw = function () {
    if (i++ < 100 - speed) return;

    if (index < data.length) {
      makeBloodPoint(data[index]);
      index++;
      speed = Math.min(speed * 1.5, 75);
      i = 0;
    } else {
      p.noLoop();
    }
  };

  function makeBloodPoint(data) {
    let size = p.map(data.nombre_succide, 0, 75000, 5, 50);

    let bloodColor;
    switch (data.age) {
      case "5-14 years":
        bloodColor = p.color("#C13617");
        break;
      case "15-24 years":
        bloodColor = p.color("#B21613");
        break;
      case "25-34 years":
        bloodColor = p.color("#A50F34");
        break;
      case "35-54 years":
        bloodColor = p.color("#992E16");
        break;
      case "55-74 years":
        bloodColor = p.color("#861C10");
        break;
      case "75+ years":
        bloodColor = p.color("#83110C");
        break;
      default:
        bloodColor = p.color("#000000");
        break;
    }

    let x;
    let y = p.height / 2;
    if (data.sex === "male") {
      x = (3 * p.width) / 4;
    } else {
      x = p.width / 4;
    }

    // Pour faire que les points soient dans le cercle
    let rayon = Math.sqrt(p.random()) * 140;
    let angle = p.random(p.TWO_PI);
    x = x + rayon * p.cos(angle);
    y = y + rayon * p.sin(angle);

    p.noStroke();
    p.fill(bloodColor);
    p.ellipse(x, y, size, size);
  }

  function drawSmileYellow() {
    p.push();
    p.translate(p.width / 2, 0);
    // cercle jaune
    p.noStroke();
    p.fill(255, 207, 0);
    p.ellipse(p.width / 4, p.height / 2, 300, 300);
    // yeux
    p.fill(0);
    p.ellipse(p.width / 6, p.height / 3 + 21, 25, 60);
    p.ellipse(p.width / 2 - p.width / 6, p.height / 3 + 21, 25, 60);
    // sourire
    p.stroke(0);
    p.strokeWeight(6);
    p.noFill();
    p.arc(p.width / 4, p.width / 3, (3 * p.width) / 14, p.width / 8, 0, p.PI);

    p.fill(0);
    p.push();
    p.translate(p.width / 4 - (3 * p.width) / 14 / 2, p.width / 3);
    p.rotate(-p.PI / 6);
    p.ellipse(0, 0, 25, 8);
    p.pop();
    p.push();
    p.translate(p.width / 4 + (3 * p.width) / 14 / 2, p.width / 3);
    p.rotate(p.PI / 6);
    p.ellipse(0, 0, 25, 8);
    p.pop();

    p.pop();
  }

  function drawSmilePink() {
    // cercle jaune
    p.noStroke();
    p.fill("#FF69B4");
    p.ellipse(p.width / 4, p.height / 2, 300, 300);
    // yeux
    p.fill(0);
    p.ellipse(p.width / 6, p.height / 3 + 21, 25, 60);
    p.ellipse(p.width / 2 - p.width / 6, p.height / 3 + 21, 25, 60);
    // sourire
    p.stroke(0);
    p.strokeWeight(6);
    p.noFill();
    p.arc(p.width / 4, p.width / 3, (3 * p.width) / 14, p.width / 8, 0, p.PI);

    p.fill(0);
    p.push();
    p.translate(p.width / 4 - (3 * p.width) / 14 / 2, p.width / 3);
    p.rotate(-p.PI / 6);
    p.ellipse(0, 0, 25, 8);
    p.pop();
    p.push();
    p.translate(p.width / 4 + (3 * p.width) / 14 / 2, p.width / 3);
    p.rotate(p.PI / 6);
    p.ellipse(0, 0, 25, 8);
    p.pop();
  }
};
