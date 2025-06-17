var sketch = function (p) {
  const side = 800;
  const nb = 35;
  const fr = 5;

  let apo;
  const sq3 = Math.sqrt(3);
  let radius;
  let radius2;

  const nb_rows = 2 * nb - 1;
  const nb_cols = nb;

  let grid = new Array(nb_rows).fill().map(() => new Array(nb_cols).fill());
  let pos = 0;
  let started = false;
  let nb_iteration = 0;
  let max_nb_iteration = 100;

  let width;
  let height;

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    apo = width / (2 * nb);
    radius = (2 * apo) / sq3;
    radius2 = radius / 2;
    p.colorMode(p.HSB, 360, 100, 100, 250);
    p.frameRate(fr);

    started = true;
    /*const button = p.select("#startButton");
    button.mousePressed(() => {
      p.createCanvas(side, side);
      button.hide();
      started = true;
    });*/

    max_nb_iteration = p.random(nb / 2, nb);
    console.log(max_nb_iteration);

    make_grid();
    initiate();
  };

  p.draw = function () {
    p.background("black");
    if (started) {
      draw_grid();
      update_all();
      if (nb_iteration >= max_nb_iteration) {
        p.noLoop();
      }
      nb_iteration++;
    }
  };

  function draw_hex(hex) {
    if (hex.alive[pos]) {
      const pts = hex.points;
      p.noStroke();
      p.fill(
        270 + p.random(-30, 30),
        90 + p.random(-10, 10),
        70 + p.random(-10, 10)
      );
      p.beginShape();
      pts.forEach((pt) => p.vertex(pt[0], pt[1]));
      p.endShape();
    }
  }

  function draw_grid() {
    grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell) draw_hex(cell);
      });
    });
  }

  function get_points(x, y) {
    return [
      [x - apo, y - radius2],
      [x, y - (apo * 2) / sq3],
      [x + apo, y - radius2],
      [x + apo, y + radius2],
      [x, y + (apo * 2) / sq3],
      [x - apo, y + radius2],
    ];
  }

  function make_grid() {
    for (let i = 0; i < nb_rows; i++) {
      for (let j = i % 2; j < nb_cols; j += 2) {
        grid[i][j] = make_hex(i, j);
      }
    }

    for (let i = 0; i < nb_rows; i++) {
      for (let j = i % 2; j < nb_cols; j += 2) {
        const cell = grid[i][j];
        if (!cell) continue;

        if (i - 1 >= 0) {
          if (j - 1 >= 0) cell.links.push([i - 1, j - 1]);
          if (j + 1 < nb_cols) cell.links.push([i - 1, j + 1]);
        }
        if (i - 2 >= 0) cell.links.push([i - 2, j]);
        if (i + 1 < nb_rows) {
          if (j - 1 >= 0) cell.links.push([i + 1, j - 1]);
          if (j + 1 < nb_cols) cell.links.push([i + 1, j + 1]);
        }
        if (i + 2 < nb_rows) cell.links.push([i + 2, j]);
      }
    }
  }

  function make_hex(i, j) {
    let x = (i + 1) * apo;
    let y = (apo * 2) / sq3 + j * ((apo * 2) / sq3 + radius2) + 50; // offset
    return {
      i: i,
      j: j,
      x: x,
      y: y,
      links: [],
      alive: [false, false],
      points: get_points(x, y),
    };
  }

  function initiate() {
    let ci = Math.floor(nb_rows / 2);
    let cj = Math.floor(nb_cols / 2);

    if (ci % 2) {
      if (!(cj % 2)) cj--;
    } else {
      if (cj % 2) cj--;
    }

    if (p.random() > 0.5) {
      grid[ci][cj].alive[0] = true;
    }

    let is = [],
      js = [];
    for (let a = 0; a < p.random(5, 7); a++) {
      let i = Math.floor(p.random(8));
      let j = p.random([0, 2, 4, 6, 8]);
      if (i % 2) j++;
      if (!is.includes(i) || !js.includes(j)) {
        grid[ci - i][cj - j].alive[0] = true;
        grid[ci + i][cj - j].alive[0] = true;
        if (p.random() > 0.5 && j != cj) {
          grid[ci - i][cj + j].alive[0] = true;
          grid[ci + i][cj + j].alive[0] = true;
        }
      }
      is.push(i);
      js.push(j);
    }
  }

  function update_cell(cell) {
    let cnt = 0;
    cell.links.forEach((link) => {
      if (grid[link[0]][link[1]].alive[pos]) cnt++;
    });

    const next = (pos + 1) % 2;
    if (cell.alive[pos]) {
      cell.alive[next] = cnt >= 2 && cnt <= 3;
    } else {
      cell.alive[next] = cnt === 2;
    }
  }

  function update_all() {
    grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell) update_cell(cell);
      });
    });
    pos = (pos + 1) % 2;
  }
};
