var sketch = function (p) {
  const side = 800;
  const nb = 50;
  const thick = 0;

  let apo_thick;
  let apo;
  const sq3 = Math.sqrt(3);
  let radius_thick;
  let radius_thick2;
  let radius;
  let radius2;

  const nb_rows = 2 * nb - 1;
  const nb_cols = nb;

  let grad = 0;
  let color_index = 0;

  let grid = new Array(nb_rows).fill().map(() => new Array(nb_cols).fill());
  let stack = [];

  let osc1, osc2;
  let duration = 0;

  const octave = 1.05946;
  let notes = [261.63, 329.63, 392.0]; // do, mi, sol
  let all_notes = [];
  let started = false;
  const fr = 42;

  let width;
  let height;

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");

    apo_thick = width / (2 * nb);
    apo = apo_thick - thick;

    radius_thick = (2 * apo_thick) / sq3;
    radius_thick2 = radius_thick / 2;
    radius = (2 * apo) / sq3;
    radius2 = radius / 2;

    osc1 = new p5.Oscillator("sine");
    osc2 = new p5.Oscillator("sine");

    start();
    started = true;
    /*const button = p.select("#startButton");
    button.mousePressed(() => {
      start();
      p.createCanvas(side, side);
      button.hide();
      started = true;
    });*/

    p.colorMode(p.HSB, 360, 100, 100, 250);
    p.frameRate(fr);
    init();
  };

  p.draw = function () {
    if (started) {
      draw_next();
      duration--;
    }
  };

  function start() {
    osc1.start();
    osc2.start();
    osc1.amp(0, 0);
    osc2.amp(0, 0);
  }

  function init() {
    make_grid();
    let a = Math.floor(p.random(2, nb_rows) / 2);
    if (a % 2) a += 1;
    stack = [grid[a][a - 2]];
    make_all_notes();
  }

  function make_all_notes() {
    for (let i = 2; i > 0; i--) {
      for (let j = 0; j < notes.length; j++) {
        all_notes.push(notes[j] / (octave * i));
      }
    }
    for (let j = 0; j < notes.length; j++) {
      all_notes.push(notes[j]);
    }
    for (let i = 1; i < 2; i++) {
      for (let j = 0; j < notes.length; j++) {
        all_notes.push(notes[j] * (octave * i));
      }
    }
  }

  function draw_next() {
    let current_cell = stack[stack.length - 1];
    if (!current_cell.visited) {
      draw_hex(current_cell);
      if (duration <= 0) {
        play_note();
      }
      current_cell.visited = true;
    } else {
      osc1.amp(0.25, 0.2);
      osc2.amp(0.125, 0.2);
    }

    let next_cell_index = get_random_unvisited_neighbour(current_cell);
    if (next_cell_index == -1) {
      stack.pop();
      if (stack.length == 0) {
        osc1.stop();
        osc2.stop();
        p.noLoop();
      }
    } else {
      open(current_cell, next_cell_index);
      let l = current_cell.links[next_cell_index];
      stack.push(grid[l[0]][l[1]]);
    }
  }

  function play_note() {
    duration = 5 + Math.floor(p.random(6));
    let r = Math.floor(p.random(all_notes.length));
    let freq = all_notes[r];
    osc1.freq(freq);
    osc2.freq(freq / octave);
    osc1.amp(0.5, 0.2);
    osc2.amp(0.25, 0.2);
  }

  function draw_hex(hex) {
    const pts = get_points(hex.x, hex.y);
    p.noStroke();
    p.fill(color_index, 25 + (color_index % 75), 60 + (color_index % 40));
    p.beginShape();
    for (let i = 0; i < 6; i++) {
      p.vertex(pts[i][0], pts[i][1]);
    }
    p.endShape();
    color_index += grad;
  }

  function count_cells() {
    let cnt = 0;
    grid.forEach((i) => {
      i.forEach((j) => {
        if (j !== undefined) cnt++;
      });
    });
    return cnt;
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
        if (i - 1 >= 0) {
          if (j - 1 >= 0) grid[i][j].links.push([i - 1, j - 1]);
          if (j + 1 < nb_cols) grid[i][j].links.push([i - 1, j + 1]);
        }
        if (i - 2 >= 0) grid[i][j].links.push([i - 2, j]);
        if (i + 1 < nb_rows) {
          if (j - 1 >= 0) grid[i][j].links.push([i + 1, j - 1]);
          if (j + 1 < nb_cols) grid[i][j].links.push([i + 1, j + 1]);
        }
        if (i + 2 < nb_rows) grid[i][j].links.push([i + 2, j]);
      }
    }

    grad = 360 / count_cells();
  }

  function make_hex(i, j) {
    return {
      i: i,
      j: j,
      x: (i + 1) * apo_thick,
      y: (apo_thick * 2) / sq3 + j * ((apo_thick * 2) / sq3 + radius_thick2),
      walls: [true, true, true, true, true, true],
      links: [],
      visited: false,
    };
  }

  function get_random_unvisited_neighbour(hex) {
    let fails = 0;
    let n = Math.floor(p.random(0, hex.links.length));
    while (fails < hex.links.length) {
      let l = hex.links[n];
      if (!grid[l[0]][l[1]].visited) return n;
      n = (n + 1) % hex.links.length;
      fails++;
    }
    return -1;
  }

  function open(hex, n) {
    let index = hex.links[n];
    let door = -1;
    if (index[0] == hex.i + 1) {
      if (index[1] == hex.j + 1) door = 3;
      else if (index[1] == hex.j - 1) door = 1;
    } else if (index[0] == hex.i - 2 && index[1] == hex.j) {
      door = 5;
    } else if (index[0] == hex.i + 2 && index[1] == hex.j) {
      door = 2;
    } else if (index[0] == hex.i - 1) {
      if (index[1] == hex.j + 1) door = 4;
      else if (index[1] == hex.j - 1) door = 0;
    }
    hex.walls[door] = false;
    grid[index[0]][index[1]].walls[(door + 3) % 6] = false;
  }
};
